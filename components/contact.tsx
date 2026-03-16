"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/data";

const CONTACT_POINTS = [
  "Kickoff stratégique sous 72h",
  "Feuille de route claire avec jalons",
  "Design + développement sous un même lead",
];

export function Contact() {
  return (
    <section
      id="contact"
      className="contact-section relative overflow-hidden border-t border-border px-6 pb-28 pt-28 md:px-8 md:pb-32 md:pt-32"
      aria-label="Contact"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
        style={{
          height: "70%",
          background: "radial-gradient(ellipse 120% 82% at 50% 100%, rgba(59, 123, 255, 0.34) 0%, transparent 72%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
        <div>
          <p
            className="label mb-8"
            style={{ fontFamily: "var(--font-m)" }}
          >
            [ CONTACT ]
          </p>

          <ScrollReveal
            variant="line"
            as="h2"
            className="mb-10 font-extrabold leading-[1.03] tracking-[-0.04em] text-white"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(46px, 7vw, 98px)",
            }}
          >
            {["Prêt à devenir", "le choix", "évident ?"].join("\n")}
          </ScrollReveal>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cursor-hover
            aria-label={`Envoyer un e-mail à ${CONTACT_EMAIL}`}
            className="contact-email-link group mb-8 inline-flex items-center gap-4 text-white transition-colors hover:text-white"
            style={{
              fontFamily: "var(--font-m)",
              fontSize: "clamp(24px, 3.6vw, 46px)",
              letterSpacing: "0.02em",
            }}
          >
            <span className="block">{CONTACT_EMAIL}</span>
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2"
              aria-hidden
            >
              →
            </span>
          </a>

          <p
            className="mb-10 text-xs uppercase tracking-[0.16em] text-(--muted)"
            style={{ fontFamily: "var(--font-m)" }}
          >
            Basé en Bretagne · Collaboration internationale
          </p>
        </div>

        <div
          className="card p-7 md:p-8"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          <p className="label mb-5" style={{ opacity: 0.45 }}>
            [ PARCOURS DE DÉMARRAGE ]
          </p>
          <div className="mb-8 space-y-3">
            {CONTACT_POINTS.map((point) => (
              <p
                key={point}
                className="flex items-center gap-3 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-m)", color: "rgba(246,246,247,0.78)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-white"
                  style={{ boxShadow: "0 0 8px rgba(255,255,255,0.75)" }}
                  aria-hidden
                />
                {point}
              </p>
            ))}
          </div>
          <div className="mb-8">
            <Link
              href="https://cal.com/eidos-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-filled w-full"
            >
              Réserver un appel découverte
              <span aria-hidden> →</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">
            {SOCIAL_LINKS.map((link) => (
              <Magnetic key={link.label} strength={0.2} radius={60}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted) transition-colors hover:text-accent"
                  style={{ fontFamily: "var(--font-m)" }}
                  aria-label={link.ariaLabel ?? link.label}
                >
                  {link.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
