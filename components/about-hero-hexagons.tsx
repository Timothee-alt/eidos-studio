"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/* ─── Grid layout ───────────────────────────────────────────────────────────
   Honeycomb flat-top orientation.
   C_STEP = horizontal distance between column centres.
   R_STEP = vertical distance between row centres.
   Even rows are offset by half a column to get the zigzag.          ──────── */
const R      = 17;                               // hex circum-radius (world units)
const GAP    = 2.2;                              // inter-hex gap
const C_STEP = Math.sqrt(3) * (R + GAP * 0.5);  // ≈ column step
const R_STEP = 1.5          * (R + GAP * 0.5);  // ≈ row step
const COLS   = 32;
const ROWS   = 24;

/* ─── Animation ─────────────────────────────────────────────────────────── */
const H_IDLE   = 0.5;   // resting prism height
const H_MAX    = 24;    // peak extrusion height on direct cursor contact
const GLOW_RAD = 148;   // interaction sphere radius (world units)
const LERP     = 0.085; // per-frame approach factor (lower = smoother)

/* ─── Colour palette ─────────────────────────────────────────────────────
   C_DARK   → idle hex body colour
   C_ACCENT → active hex body colour
   C_CAP    → additive glow cap colour (slightly lighter than accent)      ── */
const C_DARK   = new THREE.Color(0x060810);
const C_ACCENT = new THREE.Color(0x2a65e8);
const C_CAP    = new THREE.Color(0x5fa8ff);
const C_TMP    = new THREE.Color(); // reusable temp

/* ─────────────────────────────────────────────────────────────────────────── */

export function AboutHeroHexagons() {
  const mountRef = useRef<HTMLDivElement>(null);
  const heroRef  = useRef<HTMLDivElement>(null);
  const prefersRM = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    const hero  = heroRef.current;
    if (!mount || !hero) return;

    let alive = true;
    let raf: number | null = null;

    /* ── WebGL Renderer ────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050507);
    renderer.outputColorSpace   = THREE.SRGBColorSpace;
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    /* ── Scene & atmospheric fog ───────────────────────────────────────── */
    const scene = new THREE.Scene();
    // Density 0.007 → edges fade naturally without cutting too close to camera
    scene.fog = new THREE.FogExp2(0x050507, 0.007);

    /* ── Camera ────────────────────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(52, 1, 1, 1600);
    // Slight above-and-forward angle: you see prism tops AND sides for depth
    camera.position.set(0, 92, 152);
    camera.lookAt(0, 0, 24);

    /* ── Lighting ──────────────────────────────────────────────────────── */
    // Warm dark-blue ambient — fills shadow faces without washing out the grid
    scene.add(new THREE.AmbientLight(0x0c1830, 2.0));

    // Key: soft directional from top-left, gives the prism sides definition
    const keyLight = new THREE.DirectionalLight(0x9ab4e0, 0.75);
    keyLight.position.set(-80, 130, 60);
    scene.add(keyLight);

    // Mouse light: follows cursor, accent blue, drives the glow illusion
    const mLight = new THREE.PointLight(0x3b7bff, 0, 270, 1.1);
    mLight.position.set(0, 44, 0);
    scene.add(mLight);

    // Rim: fills the far-right with a cool hue, breaks the total darkness
    const rimLight = new THREE.PointLight(0x2a45bb, 20, 800, 1.4);
    rimLight.position.set(320, 110, -200);
    scene.add(rimLight);

    /* ── Build hex grid ────────────────────────────────────────────────── */
    type Hex = {
      x: number; z: number;
      glow:  number; tGlow: number; // current / target glow [0..1]
      h:     number; tH:    number; // current / target height
      wPh:   number;                // per-hex wave phase offset (for organic idle)
    };

    const hexes: Hex[] = [];
    for (let row = 0; row < ROWS; row++) {
      // Odd rows shift right by half a column → honeycomb offset
      const ox = (row & 1) ? C_STEP * 0.5 : 0;
      for (let col = 0; col < COLS; col++) {
        hexes.push({
          x: col * C_STEP + ox - (COLS * C_STEP) * 0.5,
          z: row * R_STEP      - (ROWS * R_STEP) * 0.5,
          glow: 0, tGlow: 0,
          h: 0,    tH: H_IDLE,
          wPh: Math.random() * Math.PI * 2,
        });
      }
    }
    const N = hexes.length; // ≈ 768 hexes

    /* ── Entrance Y-offsets (GSAP animates these from -55 → 0) ────────── */
    // Array of tiny proxy objects so GSAP can stagger them individually
    const eY: { v: number }[] = hexes.map(() => ({ v: prefersRM ? 0 : -55 }));

    /* ── Geometry ──────────────────────────────────────────────────────── */
    // Prism: a unit-height hexagonal cylinder — we scale Y per-instance
    const prismGeo = new THREE.CylinderGeometry(R - 1.6, R - 1.6, 1, 6, 1);
    // Cap disc: slightly smaller, sits on top of prism, additive blended
    const capGeo   = new THREE.CylinderGeometry(R * 0.76, R * 0.76, 0.5, 6, 1);

    /* ── Materials ─────────────────────────────────────────────────────── */
    const prismMat = new THREE.MeshStandardMaterial({
      metalness: 0.82,
      roughness: 0.22,
      // Constant low emissive makes idle hexes glow just enough to read
      emissive:          new THREE.Color(0x08143a),
      emissiveIntensity: 0.45,
    });
    // Cap uses additive blending → bright caps look like real top-face bloom
    const capMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity:     0.92,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
    });

    /* ── Instanced meshes ──────────────────────────────────────────────── */
    const prisms = new THREE.InstancedMesh(prismGeo, prismMat, N);
    const caps   = new THREE.InstancedMesh(capGeo,   capMat,   N);
    prisms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    caps  .instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(prisms, caps);

    // Shared dummy Object3D for matrix computation
    const dummy = new THREE.Object3D();

    /* ── syncInstances: write all matrices + colors to GPU ────────────── */
    function syncInstances() {
      for (let i = 0; i < N; i++) {
        const hx = hexes[i];
        const h  = Math.max(0.08, hx.h);    // never collapse to 0 (invisible)
        const ey = eY[i].v;                  // GSAP-driven entrance offset

        /* Prism — bottom at ey, top at h + ey, centre at h/2 + ey */
        dummy.position.set(hx.x, h * 0.5 + ey, hx.z);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        prisms.setMatrixAt(i, dummy.matrix);

        // instanceColor interpolates between almost-black and deep accent
        C_TMP.lerpColors(C_DARK, C_ACCENT, Math.min(hx.glow * 0.9, 1));
        prisms.setColorAt(i, C_TMP);

        /* Cap — sits exactly on top of the prism */
        dummy.position.set(hx.x, h + 0.25 + ey, hx.z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        caps.setMatrixAt(i, dummy.matrix);

        // Cap brightness is amplified so it blooms before the prism fully lights
        const capI = Math.min(hx.glow * 2.2, 1);
        C_TMP.copy(C_CAP).multiplyScalar(capI);
        caps.setColorAt(i, C_TMP);
      }

      prisms.instanceMatrix.needsUpdate = true;
      caps  .instanceMatrix.needsUpdate = true;
      if (prisms.instanceColor) prisms.instanceColor.needsUpdate = true;
      if (caps  .instanceColor) caps  .instanceColor.needsUpdate = true;
    }

    /* ── Mouse → world-space intersection ─────────────────────────────── */
    // We cast a ray from camera through the NDC mouse position and intersect
    // with the Y=0 horizontal plane — that gives us the hex grid mouse position.
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const rc          = new THREE.Raycaster();
    const ndcM        = new THREE.Vector2(-9999, -9999);
    const wM          = new THREE.Vector3();
    let   mouseOk     = false; // true when ray hit the plane

    function castMouse() {
      rc.setFromCamera(ndcM, camera);
      mouseOk = !!rc.ray.intersectPlane(groundPlane, wM);
    }

    /* Raw event handlers */
    const onMM = (e: MouseEvent) => {
      const b = hero.getBoundingClientRect();
      ndcM.set(
        ((e.clientX - b.left) / b.width)  * 2 - 1,
        -((e.clientY - b.top) / b.height) * 2 + 1,
      );
    };
    const onML = () => { ndcM.set(-9999, -9999); mouseOk = false; };
    const onT  = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      const b = hero.getBoundingClientRect();
      ndcM.set(
        ((t.clientX - b.left) / b.width)  * 2 - 1,
        -((t.clientY - b.top) / b.height) * 2 + 1,
      );
    };

    if (!prefersRM) {
      hero.addEventListener("mousemove",  onMM);
      hero.addEventListener("mouseleave", onML);
      hero.addEventListener("touchmove",  onT, { passive: true });
      hero.addEventListener("touchstart", onT, { passive: true });
    }

    /* ── Resize handler ────────────────────────────────────────────────── */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);         // also updates canvas CSS size
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();
    window.addEventListener("resize", onResize);

    /* ── GSAP entrance: hexes rise from below, staggered center-outward ─ */
    // We pass the eY proxy array to GSAP; stagger.grid tells it the 2-D layout
    // so it can compute each element's distance from center and delay accordingly.
    let gsapCtx: gsap.Context | undefined;
    if (!prefersRM) {
      gsapCtx = gsap.context(() => {
        gsap.to(eY, {
          v: 0,
          duration: 2.0,
          ease: "expo.out",
          stagger: {
            amount: 0.9,          // total stagger spread (seconds)
            from:   "center",     // radiate outward from grid centre
            grid:   [ROWS, COLS], // row-major layout matching our hexes array
          },
          delay: 0.1,
        });
      });
    }

    /* ── Reduced-motion: static render, no loop ────────────────────────── */
    if (prefersRM) {
      for (let i = 0; i < N; i++) { hexes[i].h = H_IDLE; hexes[i].glow = 0; }
      syncInstances();
      renderer.render(scene, camera);

      return () => {
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        prismGeo.dispose(); capGeo.dispose();
        prismMat.dispose(); capMat.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    }

    /* ── Animated render loop ──────────────────────────────────────────── */
    let elapsed = 0; // seconds, drives the idle wave

    const loop = () => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      elapsed += 0.016;

      castMouse(); // update world-space mouse position

      /* Per-hex update */
      for (let i = 0; i < N; i++) {
        const hx = hexes[i];

        /* Idle organic wave — slow sine rippling diagonally across the grid.
           Amplitude is kept low (0–0.065) so it's felt rather than seen.    */
        const wave =
          (Math.sin(elapsed * 0.5 + hx.x * 0.021 + hx.z * 0.014 + hx.wPh) * 0.5 + 0.5)
          * 0.065;

        if (mouseOk) {
          const dx = wM.x - hx.x;
          const dz = wM.z - hx.z;
          const d  = Math.sqrt(dx * dx + dz * dz);

          if (d < GLOW_RAD) {
            /* Smooth falloff: steep near cursor, tapers to zero at GLOW_RAD */
            const f   = 1 - d / GLOW_RAD;
            const pow = Math.pow(f, 1.55);
            hx.tGlow = pow + wave;
            hx.tH    = H_IDLE + (H_MAX - H_IDLE) * Math.pow(f, 1.3);
          } else {
            hx.tGlow = wave;
            hx.tH    = H_IDLE + wave * 3.5;
          }
        } else {
          /* No mouse — all hexes settle to idle wave */
          hx.tGlow = wave;
          hx.tH    = H_IDLE + wave * 3.5;
        }

        /* Lerp towards targets — LERP constant controls perceived smoothness */
        hx.glow += (hx.tGlow - hx.glow) * LERP;
        hx.h    += (hx.tH   - hx.h   ) * LERP;
      }

      /* Lazily chase mouse with the point light — lag gives it physicality */
      if (mouseOk) {
        mLight.position.x += (wM.x - mLight.position.x) * 0.1;
        mLight.position.z += (wM.z - mLight.position.z) * 0.1;
        mLight.intensity  += (145  - mLight.intensity)  * 0.07;
      } else {
        mLight.intensity  *= 0.90; // fade out smoothly when cursor leaves
      }

      syncInstances();
      renderer.render(scene, camera);
    };

    syncInstances(); // prime before first frame
    loop();

    /* ── Cleanup ───────────────────────────────────────────────────────── */
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      gsapCtx?.revert();
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("mousemove",  onMM);
      hero.removeEventListener("mouseleave", onML);
      hero.removeEventListener("touchmove",  onT);
      hero.removeEventListener("touchstart", onT);
      renderer.dispose();
      prismGeo.dispose(); capGeo.dispose();
      prismMat.dispose(); capMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [prefersRM]);

  /* ── JSX ─────────────────────────────────────────────────────────────── */
  return (
    <div ref={heroRef} id="about-hero" className="about-hero">
      {/* Three.js renderer mounts here — absolutely fills the hero */}
      <div ref={mountRef} aria-hidden style={{ position: "absolute", inset: 0 }} />

      {/* CSS overlay — untouched, pointer-events:none so WebGL gets mouse events */}
      <div className="about-hero-ovl">
        <div className="about-hero-tl">
          <span className="about-hero-line1">Eidos</span>
          <span className="about-hero-line2">Studio.</span>
        </div>
        <div className="about-hero-tr">
          48°46′N · 3°27′W
          <br />
          Studio indépendant
          <br />
          Est.&nbsp;MMXXIV
        </div>
        <div className="about-hero-bl">
          <div className="about-hero-stmt">
            <span className="about-hero-hi">Pas une agence.</span>
            <br />
            Un auteur.
          </div>
        </div>
        <div className="about-hero-br">
          <div className="about-hero-scroll-ln" />
          <div className="about-hero-scroll-lbl">Scroll</div>
        </div>
        <div className="about-hero-rd-status">
          <div className="about-hero-rd-dot" />
          Structure · Précision
        </div>
      </div>
    </div>
  );
}