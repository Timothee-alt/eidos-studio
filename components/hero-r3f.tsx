"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function GlassOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const bgColor = useMemo(() => new THREE.Color("#06060f"), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.055;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
  });

  return (
    <Float
      speed={0.7}
      rotationIntensity={0.08}
      floatIntensity={0.35}
      floatingRange={[-0.12, 0.12]}
    >
      <mesh ref={meshRef} position={[1.9, 0.05, 0]} scale={2.15}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          samples={8}
          resolution={512}
          transmission={1}
          thickness={3.0}
          roughness={0.015}
          chromaticAberration={0.085}
          distortion={0.42}
          distortionScale={0.32}
          temporalDistortion={0.1}
          color="#9ab2f0"
          background={bgColor}
        />
      </mesh>
    </Float>
  );
}

export default function HeroGlass() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 7, 4]} intensity={1.5} color="#8eb5ff" />
        <directionalLight position={[-4, -3, -3]} intensity={0.55} color="#3b7bff" />
        <pointLight position={[0, 4, 2]} intensity={0.9} color="#5c8aff" />
        <Environment preset="city" />
        <GlassOrb />
      </Canvas>
    </div>
  );
}
