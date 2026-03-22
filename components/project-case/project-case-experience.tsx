"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { ProjectCaseStudy } from "@/lib/data/projects";
import {
  ProjectCaseMinimap,
  type MinimapItem,
} from "@/components/project-case/project-case-minimap";
import { Magnetic } from "@/components/ui/magnetic";

type Teaser = Pick<
  ProjectCaseStudy,
  "slug" | "title" | "titleLines" | "hex" | "gradientBg" | "client"
>;

type Props = {
  study: ProjectCaseStudy;
  prevTeaser: Teaser | null;
  nextTeaser: Teaser | null;
};

function displayTitle(study: Pick<ProjectCaseStudy, "title" | "titleLines">) {
  if (study.titleLines) {
    return (
      <>
        {study.titleLines[0]}
        <br />
        {study.titleLines[1]}
      </>
    );
  }
  return study.title;
}

function teaserPlainTitle(t: Teaser): string {
  if (t.titleLines?.length) return t.titleLines.join(" ");
  return t.title;
}

function readingMinutes(study: ProjectCaseStudy) {
  const text = [study.leadIn, ...study.sections.map((s) => s.body)].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatOutcomeValue(v: number, step: number) {
  if (step >= 1) return String(Math.round(v));
  const rounded = Math.round(v / step) * step;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function PceOutcomeCounter({
  study,
}: {
  study: Pick<ProjectCaseStudy, "resRaw" | "resStep">;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<{
    scrollTrigger?: { kill: () => void };
    kill: () => void;
  } | null>(null);

  useEffect(() => {
    const numEl = ref.current;
    const wrap = numEl?.closest(".pce-outcome");
    if (!numEl || !wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      numEl.textContent = formatOutcomeValue(study.resRaw, study.resStep);
      return;
    }

    let dead = false;

    void (async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (dead || !numEl) return;
      gsap.registerPlugin(ScrollTrigger);

      const obj = { v: 0 };
      tweenRef.current = gsap.to(obj, {
        v: study.resRaw,
        duration: 2.35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start: "top 78%",
          once: true,
        },
        onUpdate: () => {
          if (!numEl) return;
          numEl.textContent = formatOutcomeValue(obj.v, study.resStep);
        },
      });
    })();

    return () => {
      dead = true;
      tweenRef.current?.scrollTrigger?.kill();
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [study.resRaw, study.resStep]);

  return <span ref={ref} className="pce-outcome-val-num">0</span>;
}

export function ProjectCaseExperience({ study, prevTeaser, nextTeaser }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const heroWordsRef = useRef<HTMLDivElement>(null);
  const stripPinRef = useRef<HTMLDivElement>(null);
  const stripTrackRef = useRef<HTMLDivElement>(null);
  const outcomeBlockRef = useRef<HTMLDivElement>(null);

  const minimapItems = useMemo((): MinimapItem[] => {
    const items: MinimapItem[] = [
      { id: "pce-hero", label: "Ouverture" },
      { id: "pce-intro", label: "Manifeste" },
    ];
    study.sections.forEach((s, i) => {
      items.push({
        id: `pce-narrative-${s.id}`,
        label: String(i + 1).padStart(2, "0"),
      });
    });
    items.push(
      { id: "pce-strip", label: "Séquence" },
      { id: "pce-outcome", label: "Impact" },
      { id: "pce-pivot", label: "Suite" }
    );
    return items;
  }, [study.sections]);

  const hasHeroImage = Boolean(study.image && study.image.length > 0);

  useEffect(() => {
    const bg = heroInnerRef.current?.querySelector<HTMLElement>(".pce-hero-bg--kb");
    if (!bg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    bg.style.transition = `transform ${study.kbDur}s cubic-bezier(0.25,0.46,0.45,0.94)`;
    const id = requestAnimationFrame(() => {
      bg.style.transform = study.kbTo;
    });
    return () => cancelAnimationFrame(id);
  }, [study.kbDur, study.kbTo]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let mm: {
      add: (query: string, callback: () => void | (() => void)) => void;
      revert: () => void;
    } | null = null;
    const ctxRef: { current: { revert: () => void } | null } = { current: null };

    const run = async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      mm = gsap.matchMedia();

      ctxRef.current = gsap.context(() => {
        if (progressRef.current) {
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.35,
            },
          });
        }

        const words = heroWordsRef.current?.querySelectorAll<HTMLElement>(".pce-hero-word");
        if (words?.length && !reduced) {
          gsap.set(words, {
            yPercent: 110,
            rotateX: -22,
            opacity: 0,
            transformOrigin: "50% 100%",
          });
          gsap.to(words, {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.09,
            ease: "power4.out",
            delay: 0.15,
          });
        } else if (words?.length) {
          gsap.set(words, { clearProps: "all" });
        }

        root.querySelectorAll<HTMLElement>(".pce-section").forEach((section) => {
          const q = section.querySelectorAll<HTMLElement>(".pce-reveal");
          if (!q.length) return;
          if (reduced) {
            gsap.set(q, { clearProps: "all" });
            return;
          }
          gsap.from(q, {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        });

        const ob = outcomeBlockRef.current;
        if (ob && !reduced) {
          const stat = ob.querySelector(".pce-outcome-stat");
          if (stat) {
            gsap.from(stat, {
              scale: 0.92,
              opacity: 0,
              filter: "blur(8px)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ob,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            });
          }
        }
      }, root);

      mm.add("(min-width: 769px)", () => {
        if (reduced) return () => {};
        const h = heroRef.current;
        const inner = heroInnerRef.current;
        if (!h || !inner) return () => {};
        const w = heroWordsRef.current?.querySelectorAll<HTMLElement>(".pce-hero-word");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: h,
            start: "top top",
            end: "+=130%",
            scrub: 0.85,
            pin: true,
            anticipatePin: 1,
          },
        });
        tl.to(
          inner,
          {
            scale: 0.9,
            borderRadius: 28,
            ease: "none",
          },
          0
        );
        if (w?.length) {
          tl.to(
            w,
            {
              y: -48,
              opacity: 0.12,
              stagger: 0.04,
              ease: "none",
            },
            0
          );
        }
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(min-width: 901px)", () => {
        if (reduced) return () => {};
        const pinEl = stripPinRef.current;
        const track = stripTrackRef.current;
        if (!pinEl || !track) return () => {};
        /* Aligne la fin du track au bord droit du bloc pinné — pas de marge fantôme (vide noir) */
        const scrollDist = () => {
          const w = pinEl.offsetWidth || window.innerWidth;
          return Math.max(track.scrollWidth - w, 0);
        };
        const tween = gsap.to(track, {
          x: () => -scrollDist(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: () => `+=${Math.max(scrollDist(), 1)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    };

    run();

    return () => {
      cancelled = true;
      ctxRef.current?.revert();
      ctxRef.current = null;
      mm?.revert();
      mm = null;
    };
  }, [study]);

  const cssVars = {
    "--pce-accent": study.hex,
    "--pce-kb-from": study.kbFrom,
    "--pce-kb-to": study.kbTo,
    "--pce-kb-dur": `${study.kbDur}s`,
  } as React.CSSProperties;

  const readMins = readingMinutes(study);

  return (
    <article
      ref={rootRef}
      className="pce"
      style={cssVars}
      aria-label={`Étude de cas : ${study.title} — ${study.client}`}
    >
      <ProjectCaseMinimap items={minimapItems} />

      <div className="pce-progress" aria-hidden>
        <div ref={progressRef} className="pce-progress-bar" />
      </div>

      <Link
        href="/#projets"
        className="pce-back label"
        data-cursor="view"
        data-cursor-text="RETOUR"
        aria-label="Retour à la section Projets sur la page d'accueil"
      >
        ← Projets
      </Link>

      <header id="pce-hero" className="pce-hero">
        <div ref={heroInnerRef} className="pce-hero-inner pce-hero-inner--mask">
          <div
            className="pce-hero-bg pce-hero-bg--kb"
            aria-hidden
            style={{
              transform: study.kbFrom,
              ...(hasHeroImage
                ? {}
                : {
                    background: study.gradientBg ?? "var(--bg)",
                  }),
            }}
          >
            {hasHeroImage ? (
              <Image
                src={study.image!}
                alt={`Visuel du projet « ${study.title} » — ${study.client}`}
                fill
                className="pce-hero-img object-cover"
                sizes="100vw"
                priority
                unoptimized={/^https?:\/\//.test(study.image!)}
              />
            ) : null}
          </div>
          <div
            className="pce-hero-vignette"
            aria-hidden
            style={{ background: study.grad }}
          />
          <div className="pce-hero-noise" aria-hidden />

          <div className="pce-hero-grid">
            <div className="pce-hero-meta pce-reveal">
              <span className="pce-chip">Étude de cas</span>
              <span className="pce-chip pce-chip-dim">{study.year}</span>
              {study.tags.slice(0, 3).map((t) => (
                <span key={t} className="pce-chip pce-chip-outline">
                  {t}
                </span>
              ))}
            </div>

            <p className="pce-hero-client pce-reveal">{study.client}</p>

            <div ref={heroWordsRef} className="pce-hero-words" aria-hidden={false}>
              {study.heroWords.map((w) => (
                <span key={w} className="pce-hero-word">
                  <span className="pce-hero-word-inner">{w}</span>
                </span>
              ))}
            </div>

            <p className="pce-hero-tagline pce-reveal">{study.tagline}</p>
          </div>
        </div>
      </header>

      <div id="pce-intro" className="pce-title-block pce-section">
        <nav className="pce-breadcrumb pce-reveal" aria-label="Fil d'Ariane">
          <ol>
            <li>
              <Link href="/" aria-label="Accueil — Eidos Studio">
                Accueil
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/#projets" aria-label="Projets — section sur la page d'accueil">
                Projets
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">{study.title}</li>
          </ol>
        </nav>
        <p className="pce-readtime pce-reveal label">≈ {readMins} min de lecture</p>
        <h1 className="pce-page-title pce-reveal">{displayTitle(study)}</h1>
        <p className="pce-lead pce-reveal">{study.leadIn}</p>
      </div>

      {study.sections.map((sec, i) => (
        <section
          key={sec.id}
          id={`pce-narrative-${sec.id}`}
          className={`pce-section pce-narrative pce-narrative--${sec.pacing}`}
          aria-labelledby={`pce-sec-${sec.id}`}
        >
          <div className="pce-narrative-num pce-reveal" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="pce-narrative-body">
            <p id={`pce-sec-${sec.id}`} className="pce-narrative-eyebrow label pce-reveal">
              {sec.eyebrow}
            </p>
            <h2 className="pce-narrative-headline pce-reveal">{sec.headline}</h2>
            <p className="pce-narrative-copy pce-reveal">{sec.body}</p>
          </div>
          <div className="pce-narrative-rail pce-reveal" aria-hidden>
            <span className="pce-rail-line" />
          </div>
        </section>
      ))}

      <section id="pce-strip" className="pce-strip-wrap" aria-label="Moments du projet">
        <div ref={stripPinRef} className="pce-strip-pin">
          <header className="pce-strip-hdr">
            <p className="label">Séquence</p>
            <h2 className="pce-strip-title">
              Mise en <em>scène</em>
            </h2>
            <p className="pce-strip-lede">
              Défilement horizontal sur grand écran — défilement tactile sur mobile.
            </p>
          </header>
          <div ref={stripTrackRef} className="pce-strip-track">
            {study.frames.map((f, idx) => (
              <div
                key={f.id}
                className={`pce-frame pce-frame--${f.ratio.replace("/", "-")}`}
              >
                <div
                  className="pce-frame-visual"
                  style={{
                    background: study.gradientBg
                      ? `${study.gradientBg}, linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)`
                      : undefined,
                  }}
                >
                  <span className="pce-frame-idx">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="pce-frame-shine" aria-hidden />
                </div>
                <div className="pce-frame-cap">
                  <span className="pce-frame-title">{f.title}</span>
                  <span className="pce-frame-detail">{f.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={outcomeBlockRef}
        id="pce-outcome"
        className="pce-outcome pce-section"
        aria-labelledby="pce-outcome-h"
      >
        <div className="pce-outcome-inner">
          <p id="pce-outcome-h" className="label pce-reveal">
            Résultat mesurable
          </p>
          <div className="pce-outcome-stat pce-reveal">
            <span className="pce-outcome-val">
              {study.resPrefix}
              <PceOutcomeCounter study={study} />
              {study.resSuffix}
            </span>
            <span className="pce-outcome-lbl">{study.resLabel}</span>
          </div>
          <p className="pce-deliverables pce-reveal">{study.deliverables}</p>
        </div>
      </section>

      <section id="pce-pivot" className="pce-pivot pce-section" aria-label="Autres études de cas">
        <p className="label pce-reveal">Continuer</p>
        <div className="pce-pivot-grid">
          {prevTeaser?.slug ? (
            <Link
              href={`/projets/${prevTeaser.slug}`}
              className="pce-pivot-card pce-pivot-card--prev pce-reveal"
              data-cursor="view"
              data-cursor-text="RETOUR"
              style={{ "--pce-next-accent": prevTeaser.hex } as React.CSSProperties}
              aria-label={`Étude de cas précédente : ${teaserPlainTitle(prevTeaser)} — ${prevTeaser.client}`}
            >
              <span className="pce-pivot-arrow" aria-hidden>
                ←
              </span>
              <div className="pce-pivot-copy">
                <span className="pce-pivot-label">Projet précédent</span>
                <span className="pce-pivot-title">{displayTitle(prevTeaser)}</span>
                <span className="pce-pivot-client">{prevTeaser.client}</span>
              </div>
              <div
                className="pce-pivot-visual"
                style={{
                  background: prevTeaser.gradientBg ?? "var(--bg-2)",
                }}
              />
            </Link>
          ) : null}

          {nextTeaser?.slug ? (
            <Link
              href={`/projets/${nextTeaser.slug}`}
              className="pce-pivot-card pce-pivot-card--next pce-reveal"
              data-cursor="view"
              data-cursor-text="SUITE"
              style={{ "--pce-next-accent": nextTeaser.hex } as React.CSSProperties}
              aria-label={`Étude de cas suivante : ${teaserPlainTitle(nextTeaser)} — ${nextTeaser.client}`}
            >
              <div
                className="pce-pivot-visual"
                style={{
                  background: nextTeaser.gradientBg ?? "var(--bg-2)",
                }}
              />
              <div className="pce-pivot-copy">
                <span className="pce-pivot-label">Projet suivant</span>
                <span className="pce-pivot-title">{displayTitle(nextTeaser)}</span>
                <span className="pce-pivot-client">{nextTeaser.client}</span>
              </div>
              <span className="pce-pivot-arrow" aria-hidden>
                →
              </span>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="pce-cta-bar pce-section">
        <div className="pce-reveal">
          <Magnetic strength={0.4}>
            <Link
              href="/#contact"
              className="btn-primary-filled group"
              data-cursor="view"
              data-cursor-text="OK"
              aria-label="Démarrer un projet — contacter Eidos Studio (section Contact sur l'accueil)"
            >
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
    </article>
  );
}
