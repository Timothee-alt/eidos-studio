"use client";

import { Reveal } from "@/components/ui/reveal";
import { REEL_VIDEO_URL } from "@/lib/data";

const REEL_POINTS = [
  "Séquençage narratif",
  "Chorégraphie motion",
  "Clarté d'interaction",
];

const REEL_META = [
  { label: "Livraison", value: "6-8 semaines" },
  { label: "Format", value: "Éditorial + motion" },
  { label: "Stack", value: "Next.js + Three.js" },
];

function scrollToContact() {
  const el = document.getElementById("contact");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Reel() {
  const handlePlay = () => {
    if (REEL_VIDEO_URL) {
      window.open(REEL_VIDEO_URL, "_blank", "noopener,noreferrer");
    } else {
      scrollToContact();
    }
  };

  return (
    <section
      className="relative overflow-hidden border-t border-border px-6 py-28 md:px-8 md:py-32"
      aria-label="Showreel"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 80% 15%, rgba(59,123,255,0.14), transparent 65%)",
        }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
        <div>
          <Reveal>
            <p className="label mb-8">[ CHAPITRE SHOWREEL ]</p>
          </Reveal>
          <Reveal>
            <h2
              className="mb-7 max-w-2xl font-extrabold leading-[0.97] tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-d)", fontSize: "clamp(42px, 6.4vw, 88px)" }}
            >
              Un showreel
              <br />
              qui pose votre niveau.
            </h2>
          </Reveal>
          <Reveal>
            <p
              className="mb-8 max-w-xl text-base leading-[1.75] text-(--muted)"
              style={{ fontFamily: "var(--font-b)" }}
            >
              Une séquence courte, tendue et lisible.
              Pas de déco gratuite: juste de l'impact.
            </p>
          </Reveal>
          <Reveal>
            <ul className="space-y-3 md:space-y-4">
              {REEL_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-m)", color: "rgba(246,246,247,0.78)" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-white"
                    style={{ boxShadow: "0 0 12px rgba(255,255,255,0.6)" }}
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal variant="scale">
          <div
            className="card relative overflow-hidden p-8 md:p-10"
            style={{
              minHeight: "min(72vh, 620px)",
              background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 65% 60% at 70% 22%, rgba(59,123,255,0.18) 0%, transparent 70%)",
              }}
            />
            <p className="label relative z-10 mb-6">[ LANCER LE SHOWREEL ]</p>
            <button
              type="button"
              onClick={handlePlay}
              className="group relative z-10 mb-10 flex w-full items-center justify-between gap-4 rounded-full border border-white/20 bg-white/5 px-6 py-5 text-left transition-colors hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              aria-label={REEL_VIDEO_URL ? "Lire le showreel dans un nouvel onglet" : "Aller à la section contact"}
            >
              <span
                className="font-mono text-xs uppercase tracking-[0.18em] text-white"
                style={{ fontFamily: "var(--font-m)" }}
              >
                {REEL_VIDEO_URL ? "Lire le showreel" : "Demander le showreel privé"}
              </span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-transform duration-500 group-hover:scale-110"
                aria-hidden
              >
                <svg width="12" height="14" viewBox="0 0 22 26" fill="none">
                  <path d="M2 2.5L20 13L2 23.5V2.5Z" fill="white" opacity={0.9} />
                </svg>
              </span>
            </button>
            <div className="relative z-10 grid gap-3 sm:grid-cols-3">
              {REEL_META.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 p-3">
                  <p className="label mb-1">{item.label}</p>
                  <p
                    className="text-xs uppercase tracking-[0.16em] text-white"
                    style={{ fontFamily: "var(--font-m)" }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-8 overflow-hidden"
      >
        <div className="reel-marquee">
          STORYTELLING · INTERACTION · MOTION · IMMERSION · SYSTÈME VISUEL · CONVERSION · STORYTELLING
        </div>
      </div>
    </section>
  );
}
