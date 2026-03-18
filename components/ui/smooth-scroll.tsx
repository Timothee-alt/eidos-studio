"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: import("lenis").default | null = null;
    let gsapRef: { ticker: { remove: (cb: (time: number) => void) => void } } | null = null;
    let rafCallback: ((time: number) => void) | null = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    Promise.all([
      import("lenis"),
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.default),
    ]).then(([{ default: Lenis }, gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        prevent: (element) => element.nodeName === "VERCEL-LIVE-FEEDBACK",
      });

      lenis.on("scroll", ScrollTrigger.update);
      rafCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);
      gsapRef = gsap;
    });

    return () => {
      if (gsapRef && rafCallback) {
        gsapRef.ticker.remove(rafCallback);
      }
      lenis?.destroy();
    };
  }, []);

  return null;
}
