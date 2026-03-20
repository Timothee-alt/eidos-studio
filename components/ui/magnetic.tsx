"use client";

import { useRef, useEffect } from "react";

export interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
  [key: string]: unknown;
}

export function Magnetic({
  children,
  strength = 0.35,
  radius = 100,
  className = "",
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;
    let clientX = 0;
    let clientY = 0;

    const onMouseMove = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
    };

    let rafRunning = true;

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      rafRunning = false;
      cancelAnimationFrame(rafId);
      import("gsap").then(({ default: gsap }) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            currentX = 0;
            currentY = 0;
          },
        });
      });
    };

    const onMouseEnter = () => {
      if (!rafRunning) {
        rafRunning = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      if (!rafRunning) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = clientX - centerX;
      const distY = clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      if (distance < radius) {
        const force = (1 - distance / radius) * strength;
        targetX = distX * force;
        targetY = distY * force;
      } else {
        targetX = 0;
        targetY = 0;
      }
      currentX = lerp(currentX, targetX, 0.2);
      currentY = lerp(currentY, targetY, 0.2);
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseenter", onMouseEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [strength, radius]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
