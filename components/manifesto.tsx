"use client";

import { useEffect, useRef } from "react";
import { usePreloader } from "@/lib/preloader-context";

// ─── MANIFESTE — 3 actes, scroll-scrubbed ────────────────────────────────────
//
// Acte 1 — Sites premium.
// Acte 2 — Identité unique.
// Acte 3 — Performances réelles.
//
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#60a5fa";

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { isReady } = usePreloader();

  useEffect(() => {
    if (!isReady) return;

    let ctx: gsap.Context | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
          gsap.set(
            [".mf-phrase1", ".mf-phrase2", ".mf-phrase3"],
            { opacity: 1, y: 0, x: 0, clipPath: "none", scale: 1 }
          );
          return;
        }

        // ── États initiaux ──────────────────────────────────────────────────
        gsap.set(".mf-phrase1", { clipPath: "circle(0% at 50% 50%)", scale: 0.95 });
        gsap.set(".mf-phrase2", { opacity: 0, y: 32 });
        gsap.set(".mf-phrase3", { opacity: 0, clipPath: "inset(0 100% 0 0)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=320%",
            scrub: 1.2,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        // ── ACTE 1 : Sites premium. (0 → 0.35) ─────────────────────────────
        tl.to(".mf-phrase1", {
          clipPath: "circle(150% at 50% 50%)",
          scale: 1,
          duration: 0.22,
          ease: "expo.out",
        }, 0.02);
        tl.to(".mf-phrase1", {
          scale: 0.4,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        }, 0.28);
        tl.to(".mf-act1", { opacity: 0, y: -40, duration: 0.12, ease: "power2.in" }, 0.32);

        // ── ACTE 2 : Identité unique. (0.38 → 0.68) ────────────────────────
        tl.to(".mf-phrase2", { opacity: 1, y: 0, duration: 0.28, ease: "expo.out" }, 0.40);
        tl.to(".mf-act2", { opacity: 0, y: -32, duration: 0.14, ease: "power2.in" }, 0.78);

        // ── ACTE 3 : Performances réelles. (0.82 → 1.00) ───────────────────
        tl.to(".mf-phrase3", {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.32,
          ease: "expo.out",
        }, 0.84);

      }, sectionRef);
    });

    return () => ctx?.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      id="manifeste"
      aria-label="Manifeste"
      style={{
        height: "420vh",
        contentVisibility: "visible",
        containIntrinsicSize: "unset",
      }}
    >
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(96, 165, 250, 0.05) 0%, transparent 50%), #050507",
        }}
      >
        {/* Grain overlay — profondeur */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Barre de progression — plus visible */}
        <div
          ref={progressRef}
          aria-hidden
          className="absolute top-0 left-0 z-20"
          style={{
            height: "2px",
            width: "100%",
            background: `linear-gradient(90deg, ${ACCENT} 0%, rgba(96, 165, 250, 0.3) 100%)`,
            transformOrigin: "left center",
            transform: "scaleX(0)",
            boxShadow: `0 0 12px ${ACCENT}40`,
          }}
        />

        {/* Label section */}
        <span
          aria-hidden
          className="absolute bottom-7 left-6 md:left-14 font-mono uppercase z-10"
          style={{
            fontSize: "9px",
            letterSpacing: "0.34em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          manifeste
        </span>

        {/* ═══ ACTE 1 — Sites premium. ═══ */}
        <div
          className="mf-act1 absolute inset-0 flex flex-col items-center justify-center"
          aria-label="Sites premium"
        >
          <span
            className="mf-phrase1 font-extrabold text-white tracking-tighter"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(72px, 16vw, 220px)",
              lineHeight: "0.9",
              willChange: "clip-path, transform",
            }}
          >
            Sites <span style={{ color: ACCENT }}>premium</span>.
          </span>
        </div>

        {/* ═══ ACTE 2 — Identité unique. ═══ */}
        <div
          className="mf-act2 absolute inset-0 flex flex-col justify-center"
          style={{
            paddingLeft: "clamp(24px, 5.6vw, 56px)",
            paddingRight: "clamp(24px, 5.6vw, 56px)",
          }}
        >
          <p
            className="mf-phrase2 font-extrabold text-white tracking-tight leading-[0.88]"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(48px, 10vw, 140px)",
            }}
          >
            Identité <span style={{ color: ACCENT }}>unique</span>.
          </p>
        </div>

        {/* ═══ ACTE 3 — Performances réelles. ═══ */}
        <div
          className="mf-act3 absolute inset-0 flex flex-col justify-center"
          style={{
            paddingLeft: "clamp(24px, 5.6vw, 56px)",
            paddingRight: "clamp(24px, 5.6vw, 56px)",
          }}
        >
          <p
            className="mf-phrase3 font-extrabold text-white tracking-tight leading-[0.88]"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(48px, 10vw, 140px)",
              willChange: "clip-path",
            }}
          >
            Performances <span style={{ color: ACCENT }}>réelles</span>.
          </p>
        </div>

        {/* Règle de sortie */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 z-0"
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.15), transparent)",
          }}
        />
      </div>
    </section>
  );
}
