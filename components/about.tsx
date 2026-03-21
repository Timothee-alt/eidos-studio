"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { STATS, ABOUT_DNA_TABLE, type Stat } from "@/lib/data";

function statToNumber(s: Stat) {
  return typeof s.value === "string" ? parseInt(s.value, 10) : s.value;
}

const AboutHeroGrayScott = dynamic(
  () =>
    import("@/components/about-hero-gray-scott").then((m) => m.AboutHeroGrayScott),
  { ssr: false }
);

export function About() {
  const tickRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const dnaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = tickRef.current;
    const update = () => {
      if (tick) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const totalProg = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
        tick.style.transform = `scaleX(${totalProg})`;
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;

          if (el.id === "about-manifesto") {
            const rule = document.getElementById("about-m-rule");
            if (rule) rule.classList.add("on");
          }

          if (el.id === "about-stats") {
            const reducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches;
            el.querySelectorAll(".about-stat").forEach((s, i) =>
              setTimeout(() => s.classList.add("on"), i * 200)
            );
            if (reducedMotion) {
              io.unobserve(el);
              return;
            }
            el.querySelectorAll(".about-cn").forEach((cn) => {
              const raw = (cn as HTMLElement).dataset.to;
              const to = raw ? parseInt(raw, 10) : 0;
              (cn as HTMLElement).textContent = "0";
              const dur = 2400;
              const t0 = performance.now();
              const tick = (now: number) => {
                const frac = Math.min(1, (now - t0) / dur);
                const eased = 1 - Math.pow(1 - frac, 4);
                (cn as HTMLElement).textContent = String(Math.round(eased * to));
                if (frac < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.25 }
    );

    const manifesto = manifestoRef.current;
    const stats = statsRef.current;
    if (manifesto) io.observe(manifesto);
    if (stats) io.observe(stats);

    return () => {
      if (manifesto) io.unobserve(manifesto);
      if (stats) io.unobserve(stats);
    };
  }, []);

  useEffect(() => {
    let ctx: { revert(): void } | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      const dna = dnaRef.current;
      if (!dna) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      ctx = gsap.context(() => {
        gsap.from(".about-dr", {
          opacity: 0,
          x: -20,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: dna,
            start: "top 75%",
          },
        });
      }, dna);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      id="about"
      aria-label="Le studio Eidos — présentation et ADN"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div ref={tickRef} id="about-tick" aria-hidden />

      <AboutHeroGrayScott />

      <section
        ref={manifestoRef}
        id="about-manifesto"
        className="about-manifesto"
      >
        <div className="about-m-left reveal">
          <div className="about-m-eyebrow">Position · Eidos Studio</div>
          <h2 className="about-m-heading">
            <span>Design</span>
            <span className="about-m-acc">d&apos;auteur.</span>
            <span className="about-m-ghost">Code propre.</span>
          </h2>
        </div>
        <div className="about-m-right reveal">
          <p className="about-m-body">
            Eidos Studio part du principe que le web peut être un{" "}
            <strong>médium d&apos;auteur</strong> — avec la même rigueur qu&apos;un
            objet de design industriel. Chaque livrable est pensé sur mesure&nbsp;:
            pas de template, et pas de compromis entre{" "}
            <strong>l&apos;esthétique et la performance.</strong>
          </p>
          <div className="about-m-rule" id="about-m-rule" />
        </div>
      </section>

      <div ref={statsRef} id="about-stats" className="about-stats">
        {STATS.map((stat, i) => (
          <div key={i} className="about-stat" id={`about-s${i}`}>
            <div className="about-stat-n">
              <span className="about-cn" data-to={statToNumber(stat)}>
                {statToNumber(stat)}
              </span>
              {stat.suffix ? (
                <span className="about-stat-sfx">{stat.suffix}</span>
              ) : null}
            </div>
            <div className="about-stat-l">{stat.label}</div>
            {stat.context ? (
              <p className="about-stat-c">{stat.context}</p>
            ) : null}
          </div>
        ))}
      </div>

      <section ref={dnaRef} className="about-dna" id="about-dna">
        <h2 className="about-dna-hd reveal-clip">
          ADN du <span>studio</span>
        </h2>
        {ABOUT_DNA_TABLE.map((row) => (
          <div key={row.index} className="about-dr">
            <div className="about-dr-i">{row.index}</div>
            <div className="about-dr-k">{row.key}</div>
            <div className="about-dr-sep" />
            <div className={`about-dr-v ${row.isLive ? "live" : ""}`}>
              {row.isLive && <span className="about-ld" aria-hidden />}
              {row.value}
            </div>
          </div>
        ))}
      </section>

      <section className="about-closing-simple">
        <div className="about-cs-inner reveal">
          <p className="about-cs-line">
            Du diagnostic au déploiement : jalons nets et critères mesurables. Prochaine étape pour votre
            cas&nbsp;: le contact.
          </p>
          <Link
            href="#contact"
            className="about-cl-cta"
            aria-label="Aller à la section Contact sur cette page"
          >
            <span>Aller au contact</span>
            <div className="about-cl-bar" />
            <span>↗</span>
          </Link>
        </div>
      </section>
    </section>
  );
}
