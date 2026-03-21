"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EidosSymbol } from "@/components/ui/eidos-symbol";
import { Magnetic } from "@/components/ui/magnetic";

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function NotFoundExperience() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-[#050507] text-[#f6f6f7]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: GRAIN_BG }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 72% -8%, rgba(59, 123, 255, 0.14) 0%, transparent 58%), radial-gradient(ellipse 55% 50% at 0% 100%, rgba(142, 177, 255, 0.06) 0%, transparent 55%)",
        }}
      />
      <div className="absolute right-[-18%] top-1/2 z-0 -translate-y-1/2 opacity-[0.035] pointer-events-none">
        <EidosSymbol size={920} animated />
      </div>

      <div className="relative z-10 flex min-h-[inherit] flex-col justify-between px-6 py-6 md:px-12 md:py-8">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
            [ Erreur client · 404 ]
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
            Signal perdu
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-16 md:py-20">
          <div
            className={`max-w-4xl transition-[opacity,transform] duration-[1.05s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              entered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <p className="label mb-6 md:mb-8">[ 404 ]</p>
            <div className="mb-8 md:mb-10">
              <span
                className="block font-extrabold leading-[0.82] tracking-tighter text-[#f6f6f7]"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(96px, 22vw, 280px)",
                }}
                aria-hidden="true"
              >
                404
              </span>
              <div className="mt-5 flex items-center gap-4 md:mt-7 md:gap-6">
                <span className="h-px w-12 bg-[#f6f6f7]/35 md:w-20" />
                <span
                  className="font-mono uppercase tracking-[0.45em] text-[#f6f6f7]/65"
                  style={{ fontSize: "clamp(11px, 1.4vw, 16px)" }}
                >
                  Introuvable
                </span>
              </div>
            </div>
            <h1
              id="not-found-title"
              className="mb-6 max-w-xl font-extrabold leading-[1.08] tracking-tight text-[#f6f6f7] md:mb-8"
              style={{
                fontFamily: "var(--font-d)",
                fontSize: "clamp(28px, 4.2vw, 52px)",
              }}
            >
              Page introuvable
            </h1>
            <p
              className="hero-lead mb-10 md:mb-12"
              style={{ maxWidth: "min(36rem, 92vw)" }}
            >
              La page que vous cherchez n&apos;existe pas, a été déplacée ou le
              lien est incomplet. Repartez de l&apos;accueil ou écrivez-nous pour
              un projet.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Magnetic strength={0.38}>
                <Link href="/" className="btn-primary-filled group">
                  <span className="relative z-10 flex items-center gap-2">
                    Retour à l&apos;accueil
                    <span className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Magnetic>
              <Link
                href="/#contact"
                className="btn-hero-ghost inline-flex"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Fondé en 2024 · Lannion, BZH
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
            Eidos Studio
          </span>
        </div>
      </div>
    </section>
  );
}
