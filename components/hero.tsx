"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { HERO_TAGLINE } from "@/lib/data";
import { usePreloader } from "@/lib/preloader-context";
import { Magnetic } from "@/components/ui/magnetic";
import { EidosSymbol } from "@/components/ui/eidos-symbol";

const ParticleEye = dynamic(() => import("@/components/particle-eye"), { ssr: false });

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { isReady } = usePreloader();

  // Suivi de la souris pour l'effet "Lampe torche" (Scanner)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // On met à jour les propriétés CSS qui pilotent le mask-image
    sectionRef.current.style.setProperty("--sx", `${x}px`);
    sectionRef.current.style.setProperty("--sy", `${y}px`);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // On écoute le mouvement sur toute la section
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Séquence d'animation GSAP (inchangée dans sa logique, appliquée à la nouvelle grille)
  useEffect(() => {
    if (!isReady) return;

    import("gsap").then(({ gsap }) => {
      if (!sectionRef.current || !titleRef.current) return;

      const ctx = gsap.context(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
          gsap.set([titleRef.current, "[data-hf]"], {
            clipPath: "none",
            opacity: 1,
            y: 0,
          });
          return;
        }

        // État initial
        gsap.set("[data-hf]", { opacity: 0, y: 14 });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // 1. Reveal du wordmark géant (gauche → droite)
        tl.to(titleRef.current, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.55,
          delay: 0.05,
          ease: "expo.out",
        });

        // 2. Fade in des éléments d'interface (staggered)
        tl.to(
          "[data-hf]",
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.09,
            ease: "power3.out",
          },
          "-=1.05"
        );
      }, sectionRef);

      return () => ctx.revert();
    });
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      aria-label="Accueil"
      className="relative w-full h-svh min-h-[600px] bg-[#050507] overflow-hidden text-[#f6f6f7]"
      // Lampe torche hors écran au chargement : l'œil reste caché jusqu'au premier mouvement
      style={{ "--sx": "-999px", "--sy": "-999px" } as React.CSSProperties}
    >
      {/* ── 1. LE RÉVÉLATEUR (La Lampe Torche) ── */}
      {/* Le mask-image rend cette div transparente partout SAUF autour de la souris */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
        WebkitMaskImage: "radial-gradient(circle 220px at var(--sx) var(--sy), black 10%, transparent 100%)",
        maskImage: "radial-gradient(circle 220px at var(--sx) var(--sy), black 10%, transparent 100%)",
        }}
      >
        <ParticleEye />
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
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 py-6 md:px-12 md:py-8 pointer-events-none">
        
        {/* LIGNE HAUTE : Statut */}
        <div
          className="flex items-start justify-between border-b border-white/10 pb-4 mix-blend-difference"
          data-hf
        >
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
            [ Studio Digital Immersif ]
          </span>
          <div className="flex items-center gap-3">
            <span className="dot-pulse w-1.5 h-1.5 bg-[#68e2a0] rounded-full" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#68e2a0] uppercase">
              Ouvert aux devis
            </span>
          </div>
        </div>

        {/* CENTRE : Typographie monumentale & Tagline */}
        <div className="flex-1 flex flex-col justify-center items-start text-left pb-8 pt-12 gap-10">
          
          {/* EIDOS (Milieu Gauche) */}
          <h1
            ref={titleRef}
            className="flex flex-col items-start mix-blend-difference"
            style={{
              clipPath: "inset(0 100% 0 0)", // État initial pour GSAP
              willChange: "clip-path",
            }}
          >
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

          {/* Tagline & CTA (Alignés à gauche) */}
          <div className="flex flex-col items-start mix-blend-difference pointer-events-auto ml-1 md:ml-2">
            <p
              data-hf
              className="max-w-[24ch] text-[18px] md:text-[24px] leading-[1.3] text-white/80 mb-8"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {HERO_TAGLINE}
            </p>
            <div data-hf>
              <Magnetic strength={0.4}>
                <Link href="#contact" className="btn-primary-filled group">
                  <span className="relative z-10 flex items-center gap-2">
                    Démarrer un projet
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
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
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Fondé en 2024 · Lannion, BZH
          </span>
        </div>
        
      </div>
    </section>
  );
}
