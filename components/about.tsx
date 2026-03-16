"use client";

import { Reveal } from "@/components/ui/reveal";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ABOUT_TABLE } from "@/lib/data";

const MANIFESTO = "Nous ne suivons pas les tendances. Nous construisons des présences digitales à forte gravité stratégique.";
const DESCRIPTION =
  "Eidos Studio aide les équipes ambitieuses à repositionner leur perception en ligne. Notre approche combine direction éditoriale, systèmes de motion et implémentation rigoureuse pour produire des sites premium qui convertissent avec clarté.";
const PRINCIPLES = [
  "Positionnement de marque avant décoration d'interface",
  "Design systémique plutôt que pages isolées",
  "Budgets performance dès le premier jour",
  "Architecture narrative orientée conversion",
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-border px-6 py-28 md:px-8 md:py-32"
      aria-label="Studio"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 15% 65%, rgba(59,123,255,0.11) 0%, transparent 72%)",
        }}
      />
      <span
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 font-extrabold text-text"
        style={{
          fontFamily: "var(--font-d)",
          fontSize: "22vw",
          opacity: 0.04,
          lineHeight: 1,
        }}
        aria-hidden
      >
        04
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <p className="label mb-12">[ PROFIL STUDIO ]</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center">
            <ScrollReveal
              variant="words"
              as="h2"
              className="mb-6 font-bold leading-tight text-text"
              style={{
                fontFamily: "var(--font-d)",
                letterSpacing: "-0.04em",
                fontSize: "clamp(40px, 5.2vw, 76px)",
              }}
            >
              {MANIFESTO}
            </ScrollReveal>
            <ScrollReveal variant="fade">
              <p
                className="mb-8 max-w-lg text-base leading-[1.8] text-(--muted)"
                style={{ fontFamily: "var(--font-b)" }}
              >
                {DESCRIPTION}
              </p>
            </ScrollReveal>
            <Reveal>
              <ul className="space-y-3">
                {PRINCIPLES.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-xs uppercase tracking-[0.16em]"
                    style={{ fontFamily: "var(--font-m)", color: "rgba(246,246,247,0.74)" }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-white"
                      style={{ boxShadow: "0 0 8px rgba(255,255,255,0.7)" }}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal>
            <div
              className="card overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
              }}
            >
              <table className="w-full border-collapse">
                <tbody>
                  {ABOUT_TABLE.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-border last:border-b-0"
                    >
                      <td
                        className="py-4 pl-6 pr-4 font-mono text-[10px] uppercase tracking-[0.18em] text-(--muted)"
                        style={{ fontFamily: "var(--font-m)" }}
                      >
                        {row.label}
                      </td>
                      <td
                        className={`py-4 pr-6 pl-4 font-mono text-xs uppercase tracking-[0.15em] ${
                          row.isStatus ? "text-(--green)" : "text-text"
                        }`}
                        style={{ fontFamily: "var(--font-m)" }}
                      >
                        {row.isStatus ? (
                          <span className="flex items-center gap-2">
                            <span
                              className="dot-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-(--green)"
                              style={{ boxShadow: "0 0 6px var(--green)" }}
                              aria-hidden
                            />
                            {row.value}
                          </span>
                        ) : (
                          row.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
