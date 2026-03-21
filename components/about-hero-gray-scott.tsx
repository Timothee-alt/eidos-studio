"use client";

import { useEffect, useRef } from "react";

/**
 * Gray-Scott Reaction-Diffusion — CPU simulation, WebGL display
 * Biology: dA/dt = Da∇²A − AB² + f(1−A), dB/dt = Db∇²B + AB² − (f+k)B
 * Params (coral/mitosis): f=0.0545, k=0.0630
 * Seeded from "EIDOS" text pixels — patterns grow from the name.
 */
export function AboutHeroGrayScott() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    let mounted = true;

    const SIM = 256;
    const SIM2 = SIM * SIM;
    const F = 0.0545;
    const K = 0.063;
    const Da = 1.0;
    const Db = 0.5;
    const dt = 0.5;

    let A = new Float32Array(SIM2).fill(1);
    let B = new Float32Array(SIM2);
    let nA = new Float32Array(SIM2);
    let nB = new Float32Array(SIM2);
    let texRGBA = new Uint8Array(SIM2 * 4);

    function mulberry32(s: number) {
      return function () {
        s |= 0;
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    async function seed() {
      await document.fonts.ready;
      try {
        await document.fonts.load("700 72px 'Sora'");
      } catch {
        /* fallback if load fails */
      }
      const off = document.createElement("canvas");
      off.width = off.height = SIM;
      const c2 = off.getContext("2d");
      if (!c2) return;
      c2.clearRect(0, 0, SIM, SIM);
      c2.fillStyle = "#fff";
      const fs = Math.round(SIM * 0.28);
        c2.font = `700 ${fs}px "Sora", sans-serif`;
      c2.textAlign = "left";
      c2.textBaseline = "top";
      c2.fillText("EIDOS", SIM * 0.04, SIM * 0.08);

      const px = c2.getImageData(0, 0, SIM, SIM).data;
      A.fill(1);
      B.fill(0);

      for (let i = 0; i < SIM2; i++) {
        if (px[i * 4 + 3] > 100) {
          B[i] = 1;
          A[i] = 0;
        }
      }

      const rng = mulberry32(137);
      for (let n = 0; n < 20; n++) {
        const x = Math.floor(rng() * SIM);
        const y = Math.floor(rng() * SIM);
        if (y > SIM * 0.6) {
          B[y * SIM + x] = 1;
          A[y * SIM + x] = 0;
        }
      }
    }

    function step() {
      for (let y = 0; y < SIM; y++) {
        const yn = y === 0 ? SIM - 1 : y - 1;
        const yp = y === SIM - 1 ? 0 : y + 1;
        for (let x = 0; x < SIM; x++) {
          const i = y * SIM + x;
          const xn = x === 0 ? SIM - 1 : x - 1;
          const xp = x === SIM - 1 ? 0 : x + 1;
          const a = A[i];
          const b = B[i];
          const la =
            A[yn * SIM + x] +
            A[yp * SIM + x] +
            A[i - 1 + (x === 0 ? SIM : 0)] +
            A[i + 1 - (x === SIM - 1 ? SIM : 0)] -
            4 * a;
          const lb =
            B[yn * SIM + x] +
            B[yp * SIM + x] +
            B[i - 1 + (x === 0 ? SIM : 0)] +
            B[i + 1 - (x === SIM - 1 ? SIM : 0)] -
            4 * b;
          const abb = a * b * b;
          nA[i] = Math.max(0, Math.min(1, a + dt * (Da * la - abb + F * (1 - a))));
          nB[i] = Math.max(0, Math.min(1, b + dt * (Db * lb + abb - (F + K) * b)));
        }
      }
      const ta = A;
      A = nA;
      nA = ta;
      const tb = B;
      B = nB;
      nB = tb;
    }

    let mouseGX = -1;
    let mouseGY = -1;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      mouseGX = Math.floor(((e.clientX - r.left) / r.width) * SIM);
      mouseGY = Math.floor(((e.clientY - r.top) / r.height) * SIM);
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    const handleClick = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const gx = Math.floor(((e.clientX - r.left) / r.width) * SIM);
      const gy = Math.floor(((e.clientY - r.top) / r.height) * SIM);
      for (let dy = -8; dy <= 8; dy++) {
        for (let dx = -8; dx <= 8; dx++) {
          if (dx * dx + dy * dy <= 64) {
            const xi = Math.max(0, Math.min(SIM - 1, gx + dx));
            const yi = Math.max(0, Math.min(SIM - 1, gy + dy));
            const am = (1 - Math.sqrt(dx * dx + dy * dy) / 8) * 0.9;
            B[yi * SIM + xi] = Math.min(1, B[yi * SIM + xi] + am);
            A[yi * SIM + xi] = Math.max(0, A[yi * SIM + xi] - am * 0.6);
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const r = hero.getBoundingClientRect();
      mouseGX = Math.floor(((t.clientX - r.left) / r.width) * SIM);
      mouseGY = Math.floor(((t.clientY - r.top) / r.height) * SIM);
      mouseActive = true;
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);
    hero.addEventListener("click", handleClick);
    hero.addEventListener("touchmove", handleTouchMove, { passive: true });

    function inject() {
      if (!mouseActive || mouseGX < 0) return;
      const R = 3;
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const d = dx * dx + dy * dy;
          if (d <= R * R) {
            const xi = Math.max(0, Math.min(SIM - 1, mouseGX + dx));
            const yi = Math.max(0, Math.min(SIM - 1, mouseGY + dy));
            const am = (1 - Math.sqrt(d) / R) * 0.55;
            B[yi * SIM + xi] = Math.min(1, B[yi * SIM + xi] + am);
            A[yi * SIM + xi] = Math.max(0, A[yi * SIM + xi] - am * 0.4);
          }
        }
      }
    }

    const glRaw = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!glRaw) {
      (hero as HTMLElement).style.background = "#04040A";
      return;
    }
    const gl = glRaw;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const VS = `
      attribute vec2 aP;
      varying vec2 vUV;
      void main(){
        vUV=aP*.5+.5;
        gl_Position=vec4(aP,0,1);
      }
    `;

    const FS = `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D uSim;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseA;

      float hash(vec2 p){
        return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
      }

      vec3 rdCol(float t){
        vec3 c0=vec3(0.016,0.016,0.031);
        vec3 c1=vec3(0.022,0.055,0.260);
        vec3 c2=vec3(0.055,0.220,0.980);
        vec3 c3=vec3(0.300,0.560,1.000);
        vec3 c4=vec3(0.820,0.895,1.000);
        vec3 col=c0;
        col=mix(col,c1,smoothstep(0.00,0.16,t));
        col=mix(col,c2,smoothstep(0.16,0.44,t));
        col=mix(col,c3,smoothstep(0.44,0.70,t));
        col=mix(col,c4,smoothstep(0.70,1.00,t));
        return col;
      }

      void main(){
        vec2 uv=vec2(vUV.x, 1.0-vUV.y);
        vec2 ts=vec2(1.0/256.0);

        float Bg=texture2D(uSim,uv).r;

        float n=texture2D(uSim,uv+vec2(0.0,ts.y)).r;
        float s=texture2D(uSim,uv-vec2(0.0,ts.y)).r;
        float e=texture2D(uSim,uv+vec2(ts.x,0.0)).r;
        float w=texture2D(uSim,uv-vec2(ts.x,0.0)).r;
        float edge=abs(n-s)+abs(e-w);
        float front=smoothstep(0.018,0.14,edge)*smoothstep(0.95,0.35,Bg);

        vec3 col=rdCol(Bg);
        col+=vec3(0.18,0.42,1.00)*front*1.1;
        col*=0.97+0.03*sin(uTime*0.38+Bg*6.28);

        float md=length(uv-uMouse);
        float mring=smoothstep(0.042,0.040,md)-smoothstep(0.040,0.038,md);
        float mdot=smoothstep(0.007,0.000,md);
        col+=(mring+mdot*0.6)*vec3(0.38,0.60,1.0)*uMouseA*0.55;

        float grain=hash(floor(uv*512.0))*0.015-0.0075;
        col+=grain;

        vec2 vigUV=uv-0.5;
        float vign=1.0-smoothstep(0.28,0.85,length(vigUV)*1.7);
        col*=pow(max(0.0,vign),0.72);
        col=col*(1.0+col*0.12)/(1.0+col);
        col=clamp(col,0.0,1.0);

        gl_FragColor=vec4(col,1.0);
      }
    `;

    function mkSh(type: number, src: string) {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkSh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mkSh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aP = gl.getAttribLocation(prog, "aP");
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

    const uSim = gl.getUniformLocation(prog, "uSim");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseA = gl.getUniformLocation(prog, "uMouseA");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uSim, 0);

    function upload() {
      for (let i = 0; i < SIM2; i++) {
        const v = (B[i] * 255) | 0;
        texRGBA[i * 4] = v;
        texRGBA[i * 4 + 1] = v;
        texRGBA[i * 4 + 2] = v;
        texRGBA[i * 4 + 3] = 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        SIM,
        SIM,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texRGBA
      );
    }

    let normMX = -0.1;
    let normMY = -0.1;
    const handleNormMouse = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      normMX = (e.clientX - r.left) / r.width;
      normMY = (e.clientY - r.top) / r.height;
    };
    hero.addEventListener("mousemove", handleNormMouse);

    const STEPS_PER_FRAME = 4;
    let t = 0;
    const inViewRef = { current: true };
    let raf: number | null = null;

    function loop(now: number) {
      if (!mounted || gl.isContextLost()) return;
      if (!inViewRef.current) {
        raf = null;
        return;
      }
      t = now * 0.001;

      inject();
      for (let s = 0; s < STEPS_PER_FRAME; s++) step();
      upload();

      gl.useProgram(prog);
      if (uTime && uMouse && uMouseA) {
        gl.uniform1f(uTime, t);
        gl.uniform2f(uMouse, normMX, normMY);
        gl.uniform1f(uMouseA, mouseActive ? 1 : 0);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (mounted) raf = requestAnimationFrame(loop);
    }

    const visibilityIo = new IntersectionObserver(
      ([e]) => {
        inViewRef.current = e?.isIntersecting ?? false;
        if (inViewRef.current && mounted && raf === null) {
          raf = requestAnimationFrame(loop);
        }
      },
      { root: null, rootMargin: "100px 0px", threshold: 0 }
    );
    visibilityIo.observe(hero);

    seed().then(() => {
      if (mounted && inViewRef.current && raf === null) {
        raf = requestAnimationFrame(loop);
      }
    });

    return () => {
      mounted = false;
      visibilityIo.disconnect();
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mousemove", handleNormMouse);
      hero.removeEventListener("mouseleave", handleMouseLeave);
      hero.removeEventListener("click", handleClick);
      hero.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div ref={heroRef} id="about-hero" className="about-hero">
      <canvas ref={canvasRef} id="about-hero-canvas" aria-hidden />
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
          Simulation active · Interaction souris
        </div>
      </div>
    </div>
  );
}
