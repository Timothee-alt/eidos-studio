"use client";

import { useEffect, useRef, useState } from "react";
import { STATS, ABOUT_TABLE } from "@/lib/data";
import { EidosSymbol } from "@/components/ui/eidos-symbol";

const ACCENT = "#3b7bff";
const ACCENT_LIGHT = "#8eb1ff";

const MARQUEE_ITEMS = [
  "DESIGN",
  "CODE",
  "CRAFT",
  "IDENTITÉ",
  "MOUVEMENT",
  "PERFORMANCE",
  "ÉMOTION",
  "PRÉCISION",
  "IMMERSION",
  "STRATÉGIE",
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersActive, setCountersActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let ctx: { revert(): void } | undefined;
    const splits: { revert(): void }[] = [];

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
      import("split-type").then((m) => m.default),
    ]).then(([gsap, ScrollTrigger, SplitType]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ctx = gsap.context(() => {
        if (reduced) {
          gsap.set(
            ".ab-h-words .word, .ab-h-clip, .ab-sub, .ab-para .line, .ab-marquee-wrap, .ab-stat, .ab-row, .ab-symbol-wrap, .ab-head, .ab-accent-rule",
            { opacity: 1, y: 0, x: 0, scale: 1, filter: "none", clipPath: "none" }
          );
          gsap.set(".ab-row-rule", { scaleX: 1 });
          gsap.set(".ab-accent-rule", { scaleX: 1 });
          setCountersActive(true);
          return;
        }

        // ═══ 1. LABEL ═══
        gsap.set(".ab-head", { opacity: 0, y: 12 });
        gsap.to(".ab-head", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ab-head", start: "top 88%" },
        });

        // ═══ 2. HEADLINE LINE 1 — word-by-word reveal ═══
        const h1El = section.querySelector(".ab-h-words");
        if (h1El) {
          const s = new SplitType(h1El as HTMLElement, {
            types: "words",
            tagName: "span",
          });
          splits.push(s);
          const words = h1El.querySelectorAll(".word");
          words.forEach((w) => {
            (w as HTMLElement).style.display = "inline-block";
          });

          gsap.set(words, { yPercent: 120, opacity: 0 });
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: h1El, start: "top 84%" },
          });
        }

        // ═══ 3. HEADLINE LINE 2 — clip-path reveal (gradient text) ═══
        gsap.set(".ab-h-clip", {
          clipPath: "inset(0 100% 0 0)",
        });
        gsap.to(".ab-h-clip", {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.4,
          ease: "expo.out",
          delay: 0.25,
          scrollTrigger: { trigger: ".ab-h-clip", start: "top 86%" },
        });

        // ═══ 4. ACCENT RULE ═══
        gsap.set(".ab-accent-rule", { scaleX: 0, transformOrigin: "left" });
        gsap.to(".ab-accent-rule", {
          scaleX: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".ab-accent-rule", start: "top 88%" },
        });

        // ═══ 5. SUB-STATEMENT — blur reveal ═══
        gsap.set(".ab-sub", { opacity: 0, y: 18, filter: "blur(10px)" });
        gsap.to(".ab-sub", {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ab-sub", start: "top 86%" },
        });

        // ═══ 6. PARAGRAPH — line-by-line ═══
        const paraEl = section.querySelector(".ab-para");
        if (paraEl) {
          const splitP = new SplitType(paraEl as HTMLElement, {
            types: "lines",
            tagName: "span",
          });
          splits.push(splitP);

          const lines = paraEl.querySelectorAll(".line");
          lines.forEach((line) => {
            const wrap = document.createElement("span");
            wrap.style.display = "block";
            wrap.style.overflow = "hidden";
            line.parentNode!.insertBefore(wrap, line);
            wrap.appendChild(line);
          });

          gsap.set(lines, { yPercent: 100, opacity: 0 });
          gsap.to(lines, {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: paraEl, start: "top 84%" },
          });
        }

        // ═══ 7. MARQUEE — fade in ═══
        gsap.set(".ab-marquee-wrap", { opacity: 0 });
        gsap.to(".ab-marquee-wrap", {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ab-marquee-wrap", start: "top 92%" },
        });

        // ═══ 8. STATS — stagger up + counter trigger ═══
        const statEls = gsap.utils.toArray<HTMLElement>(".ab-stat");
        gsap.set(statEls, { opacity: 0, y: 40 });

        ScrollTrigger.create({
          trigger: ".ab-stats",
          start: "top 82%",
          onEnter: () => setCountersActive(true),
        });

        statEls.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: i * 0.14,
            ease: "power3.out",
            scrollTrigger: { trigger: ".ab-stats", start: "top 82%" },
          });
        });

        // ═══ 9. TABLE ROWS — rule + content stagger ═══
        const rows = gsap.utils.toArray<HTMLElement>(".ab-row");
        rows.forEach((row, i) => {
          const rule = row.querySelector(".ab-row-rule");
          const label = row.querySelector(".ab-row-label");
          const value = row.querySelector(".ab-row-value");

          if (rule)
            gsap.set(rule, { scaleX: 0, transformOrigin: "left" });
          if (label) gsap.set(label, { opacity: 0, x: -14 });
          if (value) gsap.set(value, { opacity: 0, x: 14 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 90%" },
            delay: i * 0.07,
          });

          if (rule)
            tl.to(rule, { scaleX: 1, duration: 1.1, ease: "expo.out" });
          if (label)
            tl.to(
              label,
              { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
              "-=0.7"
            );
          if (value)
            tl.to(
              value,
              { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
              "-=0.6"
            );
        });

        // ═══ 10. SYMBOL — scale in ═══
        gsap.set(".ab-symbol-wrap", { opacity: 0, scale: 0.7 });
        gsap.to(".ab-symbol-wrap", {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".ab-symbol-wrap", start: "top 88%" },
        });
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  // Triplé pour une boucle plus fluide (reset à -33.33% au lieu de -50%)
  const marqueeRow = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];
  const reversed = MARQUEE_ITEMS.slice().reverse();
  const marqueeRow2 = [...reversed, ...reversed, ...reversed];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Studio"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--bg)",
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] pointer-events-none"
        style={{
          height: "700px",
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(59,123,255,0.05), transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════
           PART 1 — THE STATEMENT
           ═══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 px-6 md:px-14"
        style={{
          paddingTop: "clamp(100px, 18vh, 220px)",
          paddingBottom: "clamp(40px, 6vh, 80px)",
        }}
      >
        <span className="ab-head label block mb-12">Studio</span>

        <h2 className="flex flex-col gap-2">
          {/* Line 1 — white, word-by-word reveal */}
          <span
            className="ab-h-words block overflow-hidden font-extrabold tracking-tighter"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(44px, 9vw, 140px)",
              lineHeight: 0.92,
              color: "#f6f6f7",
            }}
          >
            Pas une agence.
          </span>

          {/* Line 2 — gradient, clip-path reveal left→right */}
          <span
            className="ab-h-clip block font-extrabold tracking-tighter"
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(44px, 9vw, 140px)",
              lineHeight: 0.92,
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              willChange: "clip-path",
            }}
          >
            Un studio.
          </span>
        </h2>

        {/* Accent rule */}
        <div
          className="ab-accent-rule mt-10"
          style={{
            width: "clamp(72px, 10vw, 140px)",
            height: "2px",
            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}30)`,
            boxShadow: `0 0 16px ${ACCENT}25`,
          }}
        />

        {/* Sub-statement */}
        <p
          className="ab-sub mt-10"
          style={{
            fontFamily: "var(--font-d)",
            fontWeight: 600,
            fontSize: "clamp(18px, 2.2vw, 28px)",
            lineHeight: 1.4,
            color: "rgba(246,246,247,0.65)",
            maxWidth: "34ch",
          }}
        >
          Design d&apos;auteur, code de production,{" "}
          <span style={{ color: "rgba(246,246,247,0.95)" }}>
            obsession du détail
          </span>
          .
        </p>

        {/* Philosophy paragraph */}
        <p
          className="ab-para mt-12"
          style={{
            fontFamily: "var(--font-b)",
            fontSize: "clamp(15px, 1.3vw, 19px)",
            lineHeight: 1.85,
            color: "rgba(246,246,247,0.42)",
            maxWidth: "52ch",
          }}
        >
          Eidos Studio est né d&apos;une conviction : le web mérite mieux.
          Chaque projet est une pièce unique — pensée, dessinée et développée
          avec la même exigence qu&apos;un produit d&apos;exception. Aucun
          compromis entre l&apos;esthétique et la performance.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
           PART 2 — MARQUEE BAND
           ═══════════════════════════════════════════════════════ */}
      <div
        className="ab-marquee-wrap relative z-10"
        aria-hidden
        style={{
          paddingTop: "clamp(40px, 7vh, 80px)",
          paddingBottom: "clamp(40px, 7vh, 80px)",
          transform: "rotate(-1.5deg) scale(1.04)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {/* Row 1 → right */}
        <div
          className="flex whitespace-nowrap will-change-transform"
          style={{ animation: "ab-marquee-l 45s linear infinite" }}
        >
          {marqueeRow.map((word, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span
                className="font-extrabold tracking-tight select-none"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(44px, 6.5vw, 92px)",
                  color: i % 2 === 0 ? "#f6f6f7" : ACCENT,
                  padding: "0 clamp(14px, 2.5vw, 36px)",
                }}
              >
                {word}
              </span>
              <span
                className="shrink-0 rounded-full"
                style={{
                  width: "5px",
                  height: "5px",
                  background: ACCENT,
                  opacity: 0.35,
                  boxShadow: `0 0 10px ${ACCENT}50`,
                }}
              />
            </span>
          ))}
        </div>

        {/* Row 2 ← left */}
        <div
          className="flex whitespace-nowrap mt-3 will-change-transform"
          style={{ animation: "ab-marquee-r 38s linear infinite" }}
        >
          {marqueeRow2.map((word, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span
                className="font-extrabold tracking-tight select-none"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(44px, 6.5vw, 92px)",
                  color: i % 2 === 0 ? "#f6f6f7" : ACCENT,
                  padding: "0 clamp(14px, 2.5vw, 36px)",
                }}
              >
                {word}
              </span>
              <span
                className="shrink-0 rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  background: "rgba(246,246,247,0.12)",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
           PART 3 — STATS
           ═══════════════════════════════════════════════════════ */}
      <div
        className="ab-stats relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 px-6 md:px-14"
        style={{
          paddingTop: "clamp(56px, 10vh, 120px)",
          paddingBottom: "clamp(56px, 10vh, 120px)",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="ab-stat flex flex-col"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "clamp(20px, 3vh, 36px)",
            }}
          >
            <div className="flex items-baseline gap-1">
              <span
                className="font-extrabold tracking-tighter"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(52px, 8vw, 96px)",
                  lineHeight: 1,
                  color: "#f6f6f7",
                }}
              >
                <Counter
                  to={
                    typeof stat.value === "string"
                      ? parseInt(stat.value, 10)
                      : stat.value
                  }
                  active={countersActive}
                  delay={i * 0.14}
                />
              </span>
              {stat.suffix && (
                <span
                  className="font-extrabold"
                  style={{
                    fontFamily: "var(--font-d)",
                    fontSize: "clamp(28px, 4vw, 48px)",
                    color: ACCENT,
                    lineHeight: 1,
                  }}
                >
                  {stat.suffix}
                </span>
              )}
            </div>
            <span
              className="mt-3 font-mono uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: "rgba(246,246,247,0.35)",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
           PART 4 — STUDIO DNA TABLE
           ═══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 px-6 md:px-14"
        style={{
          paddingTop: "clamp(16px, 3vh, 40px)",
          paddingBottom: "clamp(56px, 9vh, 100px)",
        }}
      >
        {ABOUT_TABLE.map((row, i) => (
          <div key={i} className="ab-row">
            <div
              className="ab-row-rule"
              style={{
                height: "1px",
                background: row.isStatus
                  ? "linear-gradient(90deg, var(--green), rgba(104,226,160,0.15) 60%, transparent)"
                  : "rgba(255,255,255,0.06)",
                transition: "background 0.5s",
              }}
            />
            <div className="flex items-center justify-between py-5 md:py-6">
              <span
                className="ab-row-label font-mono uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(246,246,247,0.3)",
                  minWidth: "clamp(90px, 14vw, 160px)",
                }}
              >
                {row.label}
              </span>
              <span
                className="ab-row-value text-right flex items-center gap-2.5"
                style={{
                  fontFamily: row.isStatus
                    ? "var(--font-m)"
                    : "var(--font-b)",
                  fontSize: row.isStatus
                    ? "11px"
                    : "clamp(14px, 1.2vw, 17px)",
                  letterSpacing: row.isStatus ? "0.18em" : "0.01em",
                  color: row.isStatus
                    ? "var(--green)"
                    : "rgba(246,246,247,0.65)",
                  textTransform: row.isStatus ? "uppercase" : "none",
                }}
              >
                {row.isStatus && (
                  <span
                    className="dot-pulse w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: "var(--green)",
                      boxShadow: "0 0 8px var(--green)",
                    }}
                  />
                )}
                {row.value}
              </span>
            </div>
          </div>
        ))}
        <div
          className="ab-row-rule"
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
           PART 5 — EIDOS SYMBOL
           ═══════════════════════════════════════════════════════ */}
      <div
        className="ab-symbol-wrap relative z-10 flex flex-col items-center"
        style={{
          paddingTop: "clamp(24px, 4vh, 56px)",
          paddingBottom: "clamp(80px, 14vh, 160px)",
        }}
      >
        <EidosSymbol size={160} animated glowing accent={ACCENT} />
        <span
          className="mt-8 font-mono uppercase"
          style={{
            fontSize: "9px",
            letterSpacing: "0.34em",
            color: "rgba(246,246,247,0.18)",
          }}
        >
          Lannion, Bretagne — 2024
        </span>
      </div>

      {/* Horizontal closing rule */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${ACCENT}18, transparent)`,
        }}
      />

      {/* Marquee keyframes — 3 copies = reset à 33.33% pour une boucle plus fluide */}
      <style>{`
        @keyframes ab-marquee-l {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes ab-marquee-r {
          from { transform: translate3d(-33.333%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </section>
  );
}

/* ── Animated Counter ──────────────────────────────────────── */

function Counter({
  to,
  active,
  delay = 0,
}: {
  to: number;
  active: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current || !ref.current) return;
    hasRun.current = true;

    import("gsap").then(({ default: gsap }) => {
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: to,
        duration: 2.4,
        delay,
        ease: "power2.out",
        snap: { v: 1 },
        onUpdate() {
          if (ref.current)
            ref.current.textContent = String(Math.round(proxy.v));
        },
      });
    });
  }, [active, to, delay]);

  return <span ref={ref}>0</span>;
}
