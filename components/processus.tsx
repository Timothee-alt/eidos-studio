"use client";

import { useEffect, useRef } from "react";

const PHASES = [
  {
    num: "01",
    title: "Cadrage",
    desc: "Comprendre le besoin, définir les objectifs, identifier les contraintes. Rien ne commence sans un brief solide.",
  },
  {
    num: "02",
    title: "Conception",
    desc: "Direction artistique, wireframes, prototypes interactifs. Le design se construit avec vous, pas en chambre.",
  },
  {
    num: "03",
    title: "Production",
    desc: "Développement front-end, intégrations, animations. Chaque composant est codé sur mesure, optimisé dès le départ.",
  },
  {
    num: "04",
    title: "Livraison",
    desc: "Tests, performance, déploiement. Le projet est livré prêt pour la production — pas « presque fini ».",
  },
];

export function Processus() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    let ctx: { revert(): void } | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      ctx = gsap.context(() => {
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { attr: { y2: 0 } },
            {
              attr: { y2: 100 },
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
                end: "bottom 80%",
                scrub: 0.5,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>(".proc-phase").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
            },
            delay: i * 0.08,
          });
        });
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="processus"
      className="proc-section"
      aria-label="Processus de collaboration en quatre phases"
    >
      <div className="proc-header reveal">
        <span className="proc-label">Processus</span>
        <h2 className="proc-heading">
          Quatre phases,
          <br />
          <em>zéro improvisation.</em>
        </h2>
      </div>

      <div className="proc-grid">
        <div className="proc-line-col" aria-hidden>
          <svg
            className="proc-svg-line"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="0"
              ref={lineRef}
              stroke="url(#proc-grad)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="proc-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,123,255,0.6)" />
                <stop offset="100%" stopColor="rgba(59,123,255,0.05)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="proc-phases">
          {PHASES.map((phase) => (
            <div key={phase.num} className="proc-phase">
              <span className="proc-num">{phase.num}</span>
              <div className="proc-content">
                <h3 className="proc-title">{phase.title}</h3>
                <p className="proc-desc">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
