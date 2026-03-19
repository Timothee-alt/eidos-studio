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
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { setReady } = usePreloader();

  useEffect(() => {
    const skip = typeof window !== "undefined" && sessionStorage.getItem(PRELOADER_VISITED_KEY);
    if (skip || prefersReducedMotion) {
      setVisible(false);
      document.body.removeAttribute("data-preloader");
      setReady();
      return;
    }

    document.body.setAttribute("data-preloader", "true");

    const run = async () => {
      const gsap = (await import("gsap")).default;

      if (prefersReducedMotion) {
        setVisible(false);
        document.body.removeAttribute("data-preloader");
        setReady();
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
        const finish = () => {
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
          setTimeout(finish, 400);
        } else {
          window.addEventListener("load", () => setTimeout(finish, 200), { once: true });
          setTimeout(finish, 3000);
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
      await new Promise((r) => setTimeout(r, 300));

      // Phase 3: Split panels open (top up, bottom down)
      const topPanel = topPanelRef.current;
      const bottomPanel = bottomPanelRef.current;

      if (topPanel && bottomPanel) {
        gsap.to(topPanel, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.out",
        });
        gsap.to(bottomPanel, {
          yPercent: 100,
          duration: 0.7,
          ease: "power4.out",
        });
      }

      await new Promise((r) => setTimeout(r, 700));

      setVisible(false);
      document.body.removeAttribute("data-preloader");
      sessionStorage.setItem(PRELOADER_VISITED_KEY, "1");
      setReady();
    };

    run();
  }, [setReady, prefersReducedMotion]);

  if (!visible) return null;

  if (prefersReducedMotion) return null;

  return (
    <div
      className="preloader-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#05050a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-hidden
    >
      {/* Split panels — cover the screen, animate out */}
      <div
        ref={topPanelRef}
        className="preloader-panel preloader-panel--top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#05050a",
          zIndex: 2,
        }}
      />
      <div
        ref={bottomPanelRef}
        className="preloader-panel preloader-panel--bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: "#05050a",
          zIndex: 2,
        }}
      />

      {/* Center content — logo + counter */}
      <div className="flex flex-col items-center gap-6" style={{ zIndex: 1 }}>
        <div ref={logoRef} className="flex flex-col items-center gap-6">
          <EidosSymbol size={64} irisOpen accent="#3b7bff" />
          <span
            className="preloader-counter-wrap font-mono text-2xl tabular-nums text-white"
            style={{
              fontFamily: "var(--font-m)",
              opacity: 1,
            }}
          >
            {counter}
          </span>
        </div>
      </div>
    </div>
  );
}
