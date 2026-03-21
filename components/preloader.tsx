"use client";

import { useEffect, useRef, useState } from "react";
import { EidosSymbol } from "@/components/ui/eidos-symbol";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePreloader } from "@/lib/preloader-context";

const PRELOADER_VISITED_KEY = "eidos-preloader-visited";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [counter, setCounter] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { setReady } = usePreloader();

  useEffect(() => {
    const skip = typeof window !== "undefined" && sessionStorage.getItem(PRELOADER_VISITED_KEY);
    if (skip || prefersReducedMotion) {
      setVisible(false);
      setReady();
      return;
    }

    // Débloque tout de suite les animations / hydratation below-the-fold.
    setReady();

    const run = async () => {
      const gsap = (await import("gsap")).default;

      if (prefersReducedMotion) {
        setVisible(false);
        return;
      }

      const resources = performance.getEntriesByType("resource");
      const totalResources = Math.max(resources.length, 1);
      let loaded = 0;

      const obj = { value: 0 };
      const updateCounter = () => setCounter(Math.round(obj.value));

      const checkReady = () => {
        const current = performance.getEntriesByType("resource").length;
        loaded = Math.min(current, totalResources);
        const progress = Math.min(100, Math.round((loaded / totalResources) * 100));
        gsap.to(obj, {
          value: progress,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: updateCounter,
        });
      };

      const interval = setInterval(checkReady, 200);
      checkReady();

      await new Promise<void>((resolve) => {
        let settled = false;
        let safetyId: ReturnType<typeof setTimeout> | undefined;

        const finish = () => {
          if (settled) return;
          settled = true;
          if (safetyId !== undefined) clearTimeout(safetyId);
          clearInterval(interval);
          gsap.to(obj, {
            value: 100,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: updateCounter,
            onComplete: resolve,
          });
        };

        if (document.readyState === "complete") {
          setTimeout(finish, 120);
        } else if (document.readyState === "interactive") {
          setTimeout(finish, 200);
        } else {
          document.addEventListener("DOMContentLoaded", () => setTimeout(finish, 180), {
            once: true,
          });
          window.addEventListener("load", () => setTimeout(finish, 80), { once: true });
          safetyId = setTimeout(finish, 2400);
        }
      });

      // Phase 1: Counter fade out (handled by hiding the counter in next phase)
      // Phase 2: Logo scale down
      const logoEl = logoRef.current;
      if (logoEl) {
        const counterWrap = logoEl.parentElement?.querySelector(".preloader-counter-wrap");
        if (counterWrap) {
          gsap.to(counterWrap, { opacity: 0, duration: 0.3 });
        }
        await new Promise((r) => setTimeout(r, 150));
        gsap.to(logoEl, {
          scale: 0.5,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
      await new Promise((r) => setTimeout(r, 220));

      // Phase 3 : fondu global — ne bloque pas lecture / scroll (pointer-events-none sur l’overlay).
      const overlayEl = overlayRef.current;
      if (overlayEl) {
        await new Promise<void>((resolve) => {
          gsap.to(overlayEl, {
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: resolve,
          });
        });
      }

      setVisible(false);
      sessionStorage.setItem(PRELOADER_VISITED_KEY, "1");
    };

    run();
  }, [setReady, prefersReducedMotion]);

  if (!visible) return null;

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={overlayRef}
      className="preloader-overlay pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        /* Trou central lisible : le hero et le texte SSR restent visibles en dessous. */
        background:
          "radial-gradient(ellipse 92% 78% at 50% 42%, rgba(5,5,10,0) 0%, rgba(5,5,10,0) 26%, rgba(5,5,10,0.82) 58%, #05050a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute left-6 right-6 top-7 z-3 flex justify-between border-b border-white/10 pb-4 md:left-10 md:right-10"
        style={{ fontFamily: "var(--font-m)" }}
      >
        <span className="text-[10px] tracking-[0.28em] text-white/35">EIDOS STUDIO</span>
        <span className="text-[10px] tracking-[0.22em] text-[#68e2a0]/90">CHARGEMENT</span>
      </div>

      {/* Barre de progression type showcase */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-3 h-px bg-white/6"
        aria-hidden
      >
        <div
          className="h-full bg-linear-to-r from-[#3b7bff] via-[#8eb1ff] to-[#68e2a0] transition-[width] duration-300 ease-out"
          style={{ width: `${counter}%` }}
        />
      </div>

      {/* Center content — logo + counter */}
      <div className="flex flex-col items-center gap-8" style={{ zIndex: 1 }}>
        <div ref={logoRef} className="flex flex-col items-center gap-7">
          <EidosSymbol size={72} irisOpen accent="#3b7bff" />
          <div className="flex flex-col items-center gap-2">
            <span
              className="preloader-counter-wrap font-mono text-4xl font-medium tabular-nums tracking-tight text-white/95 md:text-5xl"
              style={{
                fontFamily: "var(--font-m)",
                opacity: 1,
              }}
            >
              {counter}
              <span className="text-lg text-white/40 md:text-xl">%</span>
            </span>
            <span
              className="text-[10px] tracking-[0.3em] text-white/30"
              style={{ fontFamily: "var(--font-m)" }}
            >
              EXPÉRIENCE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
