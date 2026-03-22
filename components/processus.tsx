"use client";

import { Fragment, useEffect, useRef } from "react";

const PHASES = [
  {
    num: "01",
    title: "Cadrage",
    desc: "Comprendre le besoin, définir les objectifs, identifier les contraintes. Rien ne commence sans un brief solide.",
    tags: ["Brief", "Objectifs", "Périmètre"],
  },
  {
    num: "02",
    title: "Conception",
    desc: "Direction artistique, wireframes, prototypes interactifs. Le design se construit avec vous, pas en chambre.",
    tags: ["DA", "Prototype", "Itérations"],
  },
  {
    num: "03",
    title: "Production",
    desc: "Développement front-end, intégrations, animations. Chaque composant est codé sur mesure, optimisé dès le départ.",
    tags: ["Front-end", "Perf", "Motion"],
  },
  {
    num: "04",
    title: "Livraison",
    desc: "Tests, performance, déploiement. Le projet est livré prêt pour la production — pas « presque fini ».",
    tags: ["QA", "Déploiement", "Handoff"],
  },
] as const;

export function Processus() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ctx: { revert(): void } | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(".proc-phase", { opacity: 1, y: 0 });
          if (progressRef.current) gsap.set(progressRef.current, { scaleY: 1 });
          return;
        }

        if (progressRef.current) {
          gsap.fromTo(
            progressRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                end: "bottom 70%",
                scrub: 0.45,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>(".proc-phase").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 32,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
            delay: i * 0.06,
          });
        });

        phaseRefs.current.forEach((el) => {
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 52%",
            end: "bottom 48%",
            onToggle: (self) => {
              el.classList.toggle("proc-phase--active", self.isActive);
            },
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
      <div className="page-content">
        <div className="proc-layout">
          <header className="proc-aside reveal">
            <span className="proc-label">Processus</span>
            <h2 className="proc-heading">
              Quatre phases,
              <br />
              <em>zéro improvisation.</em>
            </h2>
            <p className="proc-lead">
              Un fil direct entre votre besoin et la mise en ligne : chaque étape est nommée,
              timeboxée et livrable — pas de boîte noire.
            </p>
          </header>

          <div className="proc-main">
            <div className="proc-rows">
              <div className="proc-line-progress-wrap" aria-hidden>
                <div ref={progressRef} className="proc-line-progress" />
              </div>
              {PHASES.map((phase, index) => (
                <Fragment key={phase.num}>
                  <div className="proc-dot-cell">
                    <div className="proc-node-wrap">
                      <span className="proc-node-ring" />
                      <span className="proc-node-core" />
                    </div>
                  </div>
                  <article
                    ref={(el) => {
                      phaseRefs.current[index] = el;
                    }}
                    className="proc-phase"
                    aria-labelledby={`proc-title-${phase.num}`}
                  >
                    <div className="proc-phase-head">
                      <span className="proc-num" aria-hidden>
                        {phase.num}
                      </span>
                      <h3 className="proc-title" id={`proc-title-${phase.num}`}>
                        {phase.title}
                      </h3>
                    </div>
                    <p className="proc-desc">{phase.desc}</p>
                    <ul className="proc-tags" aria-label={`Livrables — ${phase.title}`}>
                      {phase.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
