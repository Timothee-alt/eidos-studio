"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const text = textRef.current;
    if (!cursor || !dot || !text) return;

    // Show cursor on init
    gsap.set([cursor, dot], { opacity: 1 });

    // GSAP quickTo for best performance
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });
    const stretchTo = gsap.quickTo(cursor, "scaleX", { duration: 0.2, ease: "power3" });
    const squashTo = gsap.quickTo(cursor, "scaleY", { duration: 0.2, ease: "power3" });
    const rotationTo = gsap.quickTo(cursor, "rotation", { duration: 0.2, ease: "none" });

    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let isHovering = false;
    let isViewHover = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update quickTo positions
      // We subtract half width/height to center the cursor
      xTo(mouseX - 20);
      yTo(mouseY - 20);
      dotXTo(mouseX - 4);
      dotYTo(mouseY - 4);
    };

    const animateVelocity = () => {
      // Calculate velocity
      const deltaX = mouseX - lastX;
      const deltaY = mouseY - lastY;
      lastX = mouseX;
      lastY = mouseY;
      
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Calculate angle of movement
      if (velocity > 2 && !isHovering && !isViewHover) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        rotationTo(angle);
        
        // Stretch based on velocity, capped at some value
        const stretch = Math.min(1 + velocity * 0.02, 2.5);
        const squash = Math.max(1 - velocity * 0.01, 0.4);
        stretchTo(stretch);
        squashTo(squash);
      } else {
        // Return to normal shape
        stretchTo(isViewHover ? 2.2 : isHovering ? 1.5 : 1);
        squashTo(isViewHover ? 2.2 : isHovering ? 1.5 : 1);
        rotationTo(0);
      }

      rafId = requestAnimationFrame(animateVelocity);
    };
    
    rafId = requestAnimationFrame(animateVelocity);

    const onPointerOver = (e: Event) => {
      const target = e.target as Element | null;
      
      // Check for 'view' interaction
      const viewTarget = target?.closest('[data-cursor="view"]');
      if (viewTarget) {
        isViewHover = true;
        isHovering = false;
        
        const customText = viewTarget.getAttribute('data-cursor-text') || "VIEW";
        setCursorText(customText);
        
        gsap.to(cursor, {
          backgroundColor: "rgba(246,246,247,0.1)",
          backdropFilter: "blur(4px)",
          borderColor: "rgba(255,255,255,0)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(text, { opacity: 1, scale: 0.4, duration: 0.3, delay: 0.1 });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        return;
      }

      // Check for standard hover
      const hoverTarget = target?.closest("a, button, [data-cursor-hover]");
      if (hoverTarget) {
        isHovering = true;
        isViewHover = false;
        setCursorText("");
        
        gsap.to(cursor, {
          backgroundColor: "rgba(59,123,255,0.1)",
          borderColor: "rgba(59,123,255,0.7)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(text, { opacity: 0, duration: 0.2 });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      }
    };

    const onPointerOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as Element | null;
      
      const isStillViewHover = !!related?.closest('[data-cursor="view"]');
      const isStillHover = !!related?.closest("a, button, [data-cursor-hover]");
      
      if (!isStillViewHover && isViewHover) {
        isViewHover = false;
        setCursorText("");
        gsap.to(cursor, {
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          borderColor: "rgba(255,255,255,0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(text, { opacity: 0, scale: 0, duration: 0.2 });
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }

      if (!isStillHover && isHovering && !isStillViewHover) {
        isHovering = false;
        gsap.to(cursor, {
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(255,255,255,0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
    };

    const onLeaveWindow = () => {
      gsap.to([cursor, dot], { opacity: 0, duration: 0.5, ease: "power2.out" });
    };
    
    const onEnterWindow = () => {
      gsap.to([cursor, dot], { opacity: 1, duration: 0.5, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-white opacity-0 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] flex h-10 w-10 items-center justify-center rounded-full border border-white/30 opacity-0"
        style={{
          willChange: "transform, width, height",
          transformOrigin: "center center",
        }}
      >
        <span
          ref={textRef}
          className="font-mono text-[11px] font-bold uppercase tracking-widest text-white opacity-0"
          style={{ fontFamily: "var(--font-m)" }}
        >
          {cursorText}
        </span>
      </div>
    </>
  );
}
