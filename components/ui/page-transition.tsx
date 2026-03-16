"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function PageTransition() {
  const pathname = usePathname();
  const transitionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (prevPath !== pathname && transitionRef.current && textRef.current) {
      const tl = gsap.timeline();
      
      // Setup
      tl.set(transitionRef.current, { transformOrigin: "bottom", scaleY: 0 });
      tl.set(textRef.current, { y: 20, opacity: 0 });
      
      // Page Leave
      tl.to(transitionRef.current, {
        scaleY: 1,
        duration: 0.6,
        ease: "power4.inOut"
      });
      tl.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.2");
      
      // Page Enter
      tl.to(textRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.2
      });
      tl.to(transitionRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.6,
        ease: "power4.inOut"
      }, "-=0.1");
      
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  return (
    <div
      ref={transitionRef}
      aria-hidden
      className="fixed inset-0 z-[8000] pointer-events-none flex items-center justify-center bg-bg"
      style={{
        transform: "scaleY(0)"
      }}
    >
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
      <div 
        ref={textRef}
        className="font-mono text-sm tracking-[0.3em] text-white opacity-0"
      >
        CHARGEMENT
      </div>
    </div>
  );
}
