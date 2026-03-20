"use client";

import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCanvasInView } from "@/hooks/use-canvas-in-view";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function OrbScene() {
  const shellRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!shellRef.current) return;
    shellRef.current.rotation.y += delta * 0.18;
    shellRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.2;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2.4, 2.4, 3.2]} color="#3b7bff" intensity={1.5} />
      <pointLight position={[-2.8, -2.2, -3]} color="#22d3ee" intensity={0.8} />

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.22}>
        <mesh>
          <icosahedronGeometry args={[1.05, 4]} />
          <MeshDistortMaterial
            color="#3b7bff"
            emissive="#1f4fd1"
            emissiveIntensity={0.95}
            distort={0.24}
            speed={1}
            roughness={0.28}
            metalness={0.5}
            transparent
            opacity={0.72}
          />
        </mesh>
      </Float>

      <group ref={shellRef}>
        <mesh>
          <icosahedronGeometry args={[1.52, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
        </mesh>
      </group>

      <Sparkles count={64} scale={4.5} size={2} speed={0.3} color="#8eb1ff" />
    </>
  );
}

export function CapabilitiesOrb({ fill = false }: { fill?: boolean }) {
  const { ref: rootRef, inView } = useCanvasInView({ rootMargin: "100px 0px" });

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden ${fill ? "absolute inset-0" : "h-[220px] border border-white/10"}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(59,123,255,0.15) 0%, transparent 74%)",
        }}
      />
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 3.8], fov: 48 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <OrbScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
