"use client";

import type { RefObject } from "react";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCanvasInView } from "@/hooks/use-canvas-in-view";

// Palette du site Eidos
const COLORS = {
  bg: "#050507",
  text: "#f6f6f7",
  accent: "#3b7bff",
  accent2: "#8eb1ff",
  green: "#68e2a0",
} as const;

const SPOT_RADIUS_PX = 220;
const SPOT_CORE = 0.1;
const DIM_MULT = 0.25;
const BASE_OPACITY = 0.8;

export type EyePointerRef = RefObject<{ x: number; y: number }>;

function useMdScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setScale(mq.matches ? 1.35 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return scale;
}

type EyeParticlesProps = {
  pointerRef?: EyePointerRef;
};

function EyeParticles({ pointerRef }: EyeParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const spotlightUniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  /** Dernières valeurs poussées au shader spot — évite des écritures inutiles à chaque frame */
  const spotlightUniformsCacheRef = useRef<{
    dpr: number;
    bufW: number;
    bufH: number;
    px: number;
    py: number;
  } | null>(null);
  const groupScale = useMdScale();

  const [particleCount] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 7200 : 15000
  );

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const r1 = Math.random();
      const angle = Math.random() * Math.PI * 2;

      let radius;
      if (r1 < 0.15) {
        radius = Math.random() * 0.4;
        color.setHex(0x050507);
      } else {
        const striae = Math.floor(Math.random() * 100);
        const striaeAngle = (striae / 100) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;

        radius = 0.4 + Math.pow(Math.random(), 1.5) * 1.6;

        const t = (radius - 0.4) / 1.6;
        if (t < 0.3) color.setStyle(COLORS.accent);
        else if (t < 0.6) color.setStyle(COLORS.accent2);
        else if (t < 0.85) color.setStyle(COLORS.green);
        else color.setStyle(COLORS.text);
        color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.15);

        const finalAngle = striaeAngle;
        pos[i * 3] = Math.cos(finalAngle) * radius * 1.4;
        pos[i * 3 + 1] = Math.sin(finalAngle) * radius * 0.7;
        const zDepth = Math.sin((radius / 2.0) * Math.PI) * 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2 + zDepth;

        col[i * 3] = color.r;
        col[i * 3 + 1] = color.g;
        col[i * 3 + 2] = color.b;
        continue;
      }

      pos[i * 3] = Math.cos(angle) * radius * 1.4;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1 - 0.2;

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    for (let i = particleCount - 2000; i < particleCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const x = Math.cos(t) * 4.2;
      const y = Math.pow(Math.sin(t), 3) * 1.2;

      pos[i * 3] = x + (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      color.setStyle(COLORS.text);
      color.offsetHSL(0, 0, -0.1 - Math.random() * 0.3);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [particleCount]);

  const onBeforeCompileSpotlight = useCallback(
    (shader: {
      uniforms: Record<string, THREE.IUniform>;
      fragmentShader: string;
    }) => {
      shader.uniforms.uSpot = { value: new THREE.Vector2(-999, -999) };
      shader.uniforms.uBuf = { value: new THREE.Vector2(1, 1) };
      shader.uniforms.uDpr = { value: 1 };
      shader.uniforms.uDim = { value: DIM_MULT };
      shader.uniforms.uRad = { value: SPOT_RADIUS_PX };
      shader.uniforms.uCore = { value: SPOT_CORE };

      shader.fragmentShader =
        `
        uniform vec2 uSpot;
        uniform vec2 uBuf;
        uniform float uDpr;
        uniform float uDim;
        uniform float uRad;
        uniform float uCore;
        ` + shader.fragmentShader.replace(
          "#include <opaque_fragment>",
          `
          float xCss = gl_FragCoord.x / uDpr;
          float yCss = (uBuf.y - gl_FragCoord.y) / uDpr;
          vec2 cssXY = vec2(xCss, yCss);
          float d = distance(cssXY, uSpot);
          float r0 = uCore * uRad;
          float spotF = 1.0 - smoothstep(r0, uRad, d);
          float mult = mix(uDim, 1.0, spotF);
          #ifdef OPAQUE
          diffuseColor.a = 1.0;
          #endif
          #ifdef USE_TRANSMISSION
          diffuseColor.a *= material.transmissionAlpha;
          #endif
          gl_FragColor = vec4(outgoingLight * mult, diffuseColor.a * mult);
          `
        );

      spotlightUniformsRef.current = shader.uniforms;
    },
    []
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.015);

    if (!pointerRef) return;
    const u = spotlightUniformsRef.current;
    if (!u) return;
    const gl = state.gl;
    const dpr = gl.getPixelRatio();
    const bufW = gl.domElement.width;
    const bufH = gl.domElement.height;
    const p = pointerRef.current;
    const px = p.x;
    const py = p.y;
    const prev = spotlightUniformsCacheRef.current;
    if (
      prev &&
      prev.dpr === dpr &&
      prev.bufW === bufW &&
      prev.bufH === bufH &&
      prev.px === px &&
      prev.py === py
    ) {
      return;
    }
    spotlightUniformsCacheRef.current = { dpr, bufW, bufH, px, py };
    (u.uBuf as THREE.IUniform<THREE.Vector2>).value.set(bufW, bufH);
    (u.uDpr as THREE.IUniform<number>).value = dpr;
    (u.uSpot as THREE.IUniform<THREE.Vector2>).value.set(px, py);
  });

  return (
    <group scale={[groupScale, groupScale, groupScale]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={BASE_OPACITY}
          sizeAttenuation
          blending={THREE.NormalBlending}
          depthWrite={false}
          {...(pointerRef ? { onBeforeCompile: onBeforeCompileSpotlight } : {})}
        />
      </points>
    </group>
  );
}

export type ParticleEyeProps = {
  /** Coordonnées souris relatives au hero (section) — active le spot + une seule passe GPU */
  pointerRef?: EyePointerRef;
};

export default function ParticleEye({ pointerRef }: ParticleEyeProps) {
  const { ref: rootRef, inView } = useCanvasInView({ rootMargin: "80px 0px" });

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-0 flex h-full w-full items-center justify-center"
    >
      <style>{`.particle-eye-canvas-container canvas { width: 100% !important; height: 100% !important; display: block !important; }`}</style>
      <div className="particle-eye-canvas-container absolute inset-0 h-full w-full">
        <Canvas
          frameloop={inView ? "always" : "never"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
        >
          <EyeParticles pointerRef={pointerRef} />
        </Canvas>
      </div>
    </div>
  );
}
