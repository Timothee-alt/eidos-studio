"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Palette du site Eidos
const COLORS = {
  bg: "#050507",
  text: "#f6f6f7",
  accent: "#3b7bff",
  accent2: "#8eb1ff",
  green: "#68e2a0",
} as const;

function EyeParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 15000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      const r1 = Math.random();
      const angle = Math.random() * Math.PI * 2;
      
      let radius;
      if (r1 < 0.15) {
        // Pupille - très peu de particules, couleur fond du site
        radius = Math.random() * 0.4;
        color.setHex(0x050507);
      } else {
        // Iris - distribution plus dense avec des rayons
        const striae = Math.floor(Math.random() * 100);
        const striaeAngle = (striae / 100) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
        
        radius = 0.4 + Math.pow(Math.random(), 1.5) * 1.6;
        
        // Palette Eidos : accent (#3b7bff), accent2 (#8eb1ff), green (#68e2a0), text (#f6f6f7)
        const t = (radius - 0.4) / 1.6;
        if (t < 0.3) color.setStyle(COLORS.accent);
        else if (t < 0.6) color.setStyle(COLORS.accent2);
        else if (t < 0.85) color.setStyle(COLORS.green);
        else color.setStyle(COLORS.text);
        color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.15);
        
        const finalAngle = striaeAngle;
        // Forme horizontale : ellipse (x plus large que y)
        pos[i * 3] = Math.cos(finalAngle) * radius * 1.4;
        pos[i * 3 + 1] = Math.sin(finalAngle) * radius * 0.7;
        // Profondeur (z) en forme de cuvette/cornée
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
    
    // Sclère (contour de l'œil) - horizontale, couleurs texte/blanc
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
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    // Légère respiration, sans rotation (reste droit et horizontal)
    pointsRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.015);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleEye() {
  return (
    <div className="absolute inset-0 z-0 scale-100 md:scale-[1.35] origin-center">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: false, alpha: true }}>
        <EyeParticles />
      </Canvas>
    </div>
  );
}
