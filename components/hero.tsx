"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { STUDIO_CLAIM, STUDIO_SIGNATURE, TICKER_TAGS } from "@/lib/data";
import { usePreloader } from "@/lib/preloader-context";
import { Magnetic } from "@/components/ui/magnetic";
import { EidosSymbol } from "@/components/ui/eidos-symbol";

const ParticleEye = dynamic(() => import("@/components/particle-eye"), { ssr: false });

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyePointerRef = useRef({ x: -999, y: -999 });
  const { isReady } = usePreloader();

  // Coordonnées section → shader particules (lampe torche, une seule scène WebGL)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    eyePointerRef.current.x = e.clientX - rect.left;
    eyePointerRef.current.y = e.clientY - rect.top;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // On écoute le mouvement sur toute la section
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // h1 lisible dès le premier paint (LCP) ; entrée légère sur les blocs data-hf uniquement
  useEffect(() => {
    if (!isReady) return;

    import("gsap").then(({ gsap }) => {
      if (!sectionRef.current) return;

      const ctx = gsap.context(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
          gsap.set("[data-hf]", { opacity: 1, y: 0 });
          return;
        }

        gsap.set("[data-hf]", { opacity: 0, y: 12 });

        gsap.to("[data-hf]", {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.06,
        });
      }, sectionRef);

      return () => ctx.revert();
    });
  }, [isReady]);

  return (
    <>
    <section
      ref={sectionRef}
      aria-label="Introduction — Eidos Studio, page d'accueil"
      className="relative w-full h-svh min-h-[600px] bg-[#050507] overflow-hidden text-[#f6f6f7]"
    >
      {/* Poster statique : évite le vide avant le premier frame WebGL */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#050507]"
        aria-hidden
      />

      {/* Un seul WebGL : spot + atténuation globale dans le fragment shader */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <ParticleEye pointerRef={eyePointerRef} />
      </div>

      {/* ── 2. LE SYMBOLE EIDOS (Architectural en fond) ── */}
      <div className="absolute right-[-15%] top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none z-0">
        <EidosSymbol size={1000} animated={true} />
      </div>

      {/* ── 3. LA GRILLE BRUTALISTE & TYPOGRAPHIE ── */}
      {/* 
        Le pointer-events-none sur le conteneur laisse passer la souris pour le mask.
        Le mix-blend-difference permet au texte d'inverser les couleurs quand la lampe torche passe derrière !
      */}
      <div className="page-inline relative z-10 flex h-full w-full flex-col justify-between py-(--page-pad-y-hero) pointer-events-none">
        
        {/* LIGNE HAUTE : Statut */}
        <div
          className="flex items-start justify-between border-b border-white/10 pb-4 mix-blend-difference"
          data-hf
        >
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/50">
            {STUDIO_SIGNATURE}
          </span>
          <div className="flex items-center gap-3">
            <span className="dot-pulse w-1.5 h-1.5 bg-[#68e2a0] rounded-full" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#68e2a0]">
              Ouvert aux devis
            </span>
          </div>
        </div>

        {/* CENTRE : Typographie monumentale & Tagline */}
        <div className="flex-1 flex flex-col justify-center items-start text-left pb-8 pt-12 gap-6 md:gap-8">
          
          {/* EIDOS (Milieu Gauche) */}
          <h1 className="flex flex-col items-start mix-blend-difference">
            <span 
              className="font-extrabold leading-[0.82] tracking-tighter text-[#f6f6f7]"
              style={{ fontFamily: "var(--font-d)", fontSize: "clamp(80px, 17vw, 260px)" }}
            >
              EIDOS
            </span>
            <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-6 ml-1 md:ml-2">
              <span className="w-12 md:w-20 h-px bg-[#f6f6f7]/40" />
              <span 
                className="font-mono uppercase tracking-[0.5em] text-[#f6f6f7]/70"
                style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}
              >
                Studio
              </span>
            </div>
          </h1>
          <p className="hero-lead ml-1 md:ml-2 mix-blend-difference" data-hf>
            {STUDIO_CLAIM}
          </p>

          {/* CTA */}
          <div className="flex flex-col items-start mix-blend-difference pointer-events-auto ml-1 md:ml-2">
            <div data-hf>
              <Magnetic strength={0.4}>
                <Link
                  href="#contact"
                  className="btn-primary-filled group"
                  aria-label="Démarrer un projet — aller à la section Contact"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Démarrer un projet
                    <span className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* LIGNE BASSE : Infos & Scroll */}
        <div
          className="flex items-end justify-between border-t border-white/10 pt-4 mix-blend-difference"
          data-hf
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
            Fondé en 2024 · Lannion, BZH
          </span>
        </div>
        
      </div>
    </section>

    {/* Ticker strip — stack & techno (marquee infini) */}
    <div className="hero-ticker" aria-hidden>
      <div className="hero-ticker-track">
        {[...TICKER_TAGS, ...TICKER_TAGS].map((tag, i) => (
          <span key={i}>
            <span className="hero-ticker-item">{tag}</span>
            {i < TICKER_TAGS.length * 2 - 1 && <span className="hero-ticker-sep"> · </span>}
          </span>
        ))}
      </div>
    </div>
    </>
  );
}
