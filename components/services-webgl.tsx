"use client";

import { useEffect, useRef } from "react";
import type { ServiceSlide } from "@/lib/data";

const VERT = `
attribute vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.,1.);}
`;

const FRAG = `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_col;
uniform float u_intensity;
uniform vec3  u_prev_col;
uniform float u_prev_intensity;
uniform float u_blend;
uniform vec2  u_mouse;
uniform float u_panel_width;

vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x2s=x_*ns.x+ns.yyyy;
  vec4 y2s=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x2s)-abs(y2s);
  vec4 b0=vec4(x2s.xy,y2s.xy);
  vec4 b1=vec4(x2s.zw,y2s.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float panelFrac = u_panel_width > 0.0 ? (u_panel_width / u_res.x) : 0.0;
  if(panelFrac > 0.0 && uv.x < panelFrac){ gl_FragColor=vec4(0.); return; }

  float t = u_time * 0.28;
  vec2 mouse_offset = (u_mouse - uv) * 0.28 * u_intensity;

  float n  = snoise(vec3((uv + mouse_offset) * 2.2,        t * 0.9));
  float n2 = snoise(vec3((uv + mouse_offset * 0.5) * 4.4 + 1.3, t * 1.4));
  float n3 = snoise(vec3(uv * 1.1 - 0.7,                  t * 0.5));

  float fluid = n * 0.55 + n2 * 0.28 + n3 * 0.17;
  fluid = fluid * 0.5 + 0.5;

  vec3  col    = mix(u_prev_col,       u_col,           u_blend);
  float intens = mix(u_prev_intensity, u_intensity,     u_blend);

  vec2  viguv   = uv * 2. - 1.;
  float vignette = 1. - dot(viguv * vec2(0.5,0.8), viguv * vec2(0.5,0.8));
  vignette = clamp(vignette, 0., 1.);
  vignette = pow(vignette, 0.55);

  float brightness = fluid * intens * vignette * 0.92;
  vec3  finalCol   = col * brightness;
  gl_FragColor     = vec4(finalCol, min(brightness * 1.0, 1.0));
}
`;

type ServicesWebGLProps = {
  slides: ServiceSlide[];
  activeIdx: number;
  rightContainerRef?: React.RefObject<HTMLElement | null>;
  mouseTargetRef?: React.MutableRefObject<[number, number]>;
  sectionRef?: React.RefObject<HTMLElement | null>;
};

export function ServicesWebGL({
  slides,
  activeIdx,
  rightContainerRef,
  mouseTargetRef: externalMouseRef,
  sectionRef,
}: ServicesWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    shaderCur: 0,
    shaderPrev: 0,
    blendT: 1.0,
    blendStart: 0,
  });
  const internalMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const mouseTargetRef = externalMouseRef ?? internalMouseRef;
  const mouseCurRef = useRef([0.5, 0.5]);

  useEffect(() => {
    const s = stateRef.current;
    if (activeIdx !== s.shaderCur) {
      s.shaderPrev = s.shaderCur;
      s.shaderCur = activeIdx;
      s.blendT = 0;
      s.blendStart = performance.now();
    }
  }, [activeIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || slides.length === 0) return;

    const ctx =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!ctx) return;
    const gl = ctx as WebGLRenderingContext;

    function compileShader(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uCol = gl.getUniformLocation(prog, "u_col");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");
    const uPrevCol = gl.getUniformLocation(prog, "u_prev_col");
    const uPrevInten = gl.getUniformLocation(prog, "u_prev_intensity");
    const uBlend = gl.getUniformLocation(prog, "u_blend");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uPanelWidth = gl.getUniformLocation(prog, "u_panel_width");

    function getPanelWidth() {
      return typeof window !== "undefined" && window.innerWidth >= 880 ? 360 : 0;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const BLEND_DUR = 900;
    const startTime = performance.now();
    let rafId: number | null = null;
    const visibleRef = { current: true };
    let lastResW = -1;
    let lastResH = -1;
    let lastPanelW = Number.NaN;

    const sectionEl = sectionRef?.current;
    const visibilityIo =
      sectionEl &&
      new IntersectionObserver(
        ([e]) => {
          const vis = e?.isIntersecting ?? true;
          visibleRef.current = vis;
          if (vis && rafId === null) {
            rafId = requestAnimationFrame(renderGL);
          }
        },
        { root: null, rootMargin: "140px 0px", threshold: 0 }
      );
    if (sectionEl && visibilityIo) visibilityIo.observe(sectionEl);

    function resizeCanvas() {
      const el = canvasRef.current;
      if (!el) return;
      // Size to the visible WebGL host (pin wrap / ~100vh), not `#capabilities`
      // height (N×100vh) — oversized buffers can lose WebGL context → black canvas.
      let w = window.innerWidth;
      let h = window.innerHeight;
      const host = el.parentElement;
      if (host) {
        const rect = host.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          w = Math.round(rect.width);
          h = Math.round(rect.height);
        }
      }
      el.width = w;
      el.height = h;
      gl.viewport(0, 0, el.width, el.height);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    const ro = new ResizeObserver(resizeCanvas);
    const resizeHost = canvasRef.current?.parentElement;
    if (resizeHost) ro.observe(resizeHost);

    function renderGL(now: number) {
      if (!visibleRef.current) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(renderGL);
      if (gl.isContextLost()) return;
      const s = stateRef.current;
      if (s.blendT < 1.0) {
        s.blendT = Math.min(1.0, (now - s.blendStart) / BLEND_DUR);
      }

      mouseCurRef.current[0] +=
        (mouseTargetRef.current[0] - mouseCurRef.current[0]) * 0.04;
      mouseCurRef.current[1] +=
        (mouseTargetRef.current[1] - mouseCurRef.current[1]) * 0.04;

      const cur = slides[s.shaderCur];
      const prev = slides[s.shaderPrev];
      if (!cur || !prev) return;

      const locs = [uRes, uTime, uCol, uIntensity, uPrevCol, uPrevInten, uBlend, uMouse, uPanelWidth];
      if (locs.some((l) => l == null)) return;

      const cw = canvas!.width;
      const ch = canvas!.height;
      if (cw !== lastResW || ch !== lastResH) {
        lastResW = cw;
        lastResH = ch;
        gl.uniform2f(uRes!, cw, ch);
      }

      gl.uniform1f(uTime!, (now - startTime) * 0.001);
      gl.uniform3fv(uCol!, cur.color);
      gl.uniform1f(uIntensity!, cur.shaderIntensity);
      gl.uniform3fv(uPrevCol!, prev.color);
      gl.uniform1f(uPrevInten!, prev.shaderIntensity);
      gl.uniform1f(uBlend!, s.blendT);
      gl.uniform2fv(uMouse!, mouseCurRef.current);
      const panelW = getPanelWidth();
      if (panelW !== lastPanelW) {
        lastPanelW = panelW;
        gl.uniform1f(uPanelWidth!, panelW);
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    rafId = requestAnimationFrame(renderGL);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      visibilityIo?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      ro.disconnect();
    };
  }, [slides, rightContainerRef, mouseTargetRef, sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      id="services-glcanvas"
      className="services-glcanvas"
      aria-hidden
    />
  );
}
