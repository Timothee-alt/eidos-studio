"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const ACCENTS = [
  { hex: "#a78bfa", rgb: "167,139,250" },
  { hex: "#3b7bff", rgb: "59,123,255" },
  { hex: "#22d3ee", rgb: "34,211,238" },
  { hex: "#68e2a0", rgb: "104,226,160" },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR = "0.75s";

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [entered, setEntered] = useState(false);
  const reduced = usePrefersReducedMotion();

  const trackPointer = useCallback((e: React.PointerEvent, i: number) => {
    const el = panelRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  useEffect(() => {
    if (reduced) {
      setEntered(true);
      setActive(0);
      return;
    }

    let ctx: { revert(): void } | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ST]) => {
      gsap.registerPlugin(ST);
      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(sectionRef);
        gsap.set(q(".exp-rule"), { scaleX: 0, transformOrigin: "left" });
        gsap.set(q(".exp-num"), { yPercent: 120, opacity: 0 });
        gsap.set(q(".exp-title"), { opacity: 0, x: 48 });
        gsap.set(q(".exp-head"), { opacity: 0, y: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        });

        tl.to(q(".exp-head"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        })
          .to(
            q(".exp-rule"),
            { scaleX: 1, duration: 1.2, stagger: 0.09, ease: "expo.out" },
            "-=0.35"
          )
          .to(
            q(".exp-num"),
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.07,
              ease: "power4.out",
            },
            "-=0.85"
          )
          .to(
            q(".exp-title"),
            {
              opacity: 1,
              x: 0,
              duration: 0.85,
              stagger: 0.07,
              ease: "power3.out",
            },
            "-=0.75"
          )
          .call(
            () => {
              setEntered(true);
              setActive(0);
            },
            [],
            "+=0.1"
          );
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, [reduced]);

  const focusButton = useCallback((index: number) => {
    const el = buttonRefs.current[index];
    if (el) el.focus();
  }, []);

  const onHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      const last = SERVICES.length - 1;
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          focusButton(i === last ? 0 : i + 1);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          focusButton(i === 0 ? last : i - 1);
          break;
        }
        case "Home": {
          e.preventDefault();
          focusButton(0);
          break;
        }
        case "End": {
          e.preventDefault();
          focusButton(last);
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          setActive((cur) => (cur === i ? -1 : i));
          break;
        }
      }
    },
    [focusButton]
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-label="Expertises"
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--bg)",
        paddingBottom: "clamp(72px, 12vh, 140px)",
      }}
    >
      {/* Grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── HEADER ── */}
      <div
        className="relative z-10 flex items-baseline justify-between px-6 md:px-14"
        style={{
          paddingTop: "clamp(80px, 14vh, 160px)",
          paddingBottom: "clamp(36px, 5vh, 56px)",
        }}
      >
        <span className="exp-head label">Expertises</span>
        <span
          className="exp-head font-mono uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.18)",
          }}
        >
          /{String(SERVICES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── ACCORDION ── */}
      <div className="relative z-10 flex flex-col">
        {SERVICES.map((svc, i) => {
          const isOpen = active === i;
          const a = ACCENTS[i % ACCENTS.length];
          const panelId = `services-panel-${svc.id}`;
          const buttonId = `services-button-${svc.id}`;

          return (
            <div key={svc.id}>
              {/* Separator line */}
              <div
                className="exp-rule h-px mx-6 md:mx-14"
                style={{
                  background: isOpen
                    ? `linear-gradient(90deg, ${a.hex}55, ${a.hex}10 80%, transparent)`
                    : "rgba(255,255,255,0.06)",
                  transition: "background 0.6s",
                }}
              />

              {/* Panel */}
              <div
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="exp-panel relative overflow-hidden"
                style={
                  {
                    "--px": "50%",
                    "--py": "50%",
                    height: entered
                      ? isOpen
                        ? "clamp(300px, 46vh, 440px)"
                        : "clamp(72px, 10vh, 92px)"
                      : "clamp(72px, 10vh, 92px)",
                    transition: `height ${DUR} ${EASE}`,
                  } as React.CSSProperties
                }
                onPointerMove={(e) => trackPointer(e, i)}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
                  style={{
                    background: a.hex,
                    transform: isOpen ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "center",
                    opacity: isOpen ? 1 : 0,
                    transition: `transform 0.65s ${EASE}, opacity 0.4s`,
                    boxShadow: isOpen
                      ? `0 0 18px rgba(${a.rgb},0.35)`
                      : "none",
                  }}
                />

                {/* Mouse-following spotlight */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 520px 360px at var(--px) var(--py), rgba(${a.rgb},0.07), transparent 70%)`,
                    opacity: isOpen ? 1 : 0,
                    transition: "opacity 0.5s",
                  }}
                />

                {/* Content row */}
                <button
                  ref={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  id={buttonId}
                  type="button"
                  className="relative z-10 w-full flex px-6 md:px-14 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15 focus-visible:ring-offset-0"
                  style={{
                    alignItems: isOpen ? "flex-start" : "center",
                    paddingTop: isOpen ? "clamp(28px, 4vh, 40px)" : "0",
                    transition: `padding-top ${DUR} ${EASE}`,
                    cursor: "pointer",
                    minHeight: "clamp(72px, 10vh, 92px)",
                  }}
                  onClick={() => setActive((cur) => (cur === i ? -1 : i))}
                  onKeyDown={(e) => onHeaderKeyDown(e, i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  {/* Index number — outlined when closed, filled when open */}
                  <div
                    className="overflow-hidden shrink-0"
                    style={{ width: "clamp(52px, 9vw, 110px)" }}
                  >
                    <span
                      className="exp-num block font-extrabold leading-none tracking-tighter select-none"
                      style={{
                        fontFamily: "var(--font-d)",
                        whiteSpace: "nowrap",
                        fontSize: isOpen
                          ? "clamp(28px, 3.4vw, 36px)"
                          : "clamp(20px, 2.4vw, 28px)",
                        WebkitTextStroke: isOpen
                          ? "none"
                          : "1px rgba(255,255,255,0.1)",
                        color: isOpen ? a.hex : "transparent",
                        transition: `font-size ${DUR} ${EASE}, color 0.45s, -webkit-text-stroke 0.45s`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0 ml-4 md:ml-8 flex flex-col justify-center">
                    <h3
                      className="exp-title font-extrabold tracking-tight leading-[0.92]"
                      style={{
                        fontFamily: "var(--font-d)",
                        fontSize: isOpen
                          ? "clamp(28px, 4.2vw, 52px)"
                          : "clamp(17px, 2vw, 24px)",
                        color: isOpen ? "#fff" : "rgba(255,255,255,0.6)",
                        transition: `font-size ${DUR} ${EASE}, color 0.45s`,
                      }}
                    >
                      {svc.title}
                    </h3>
                  </div>
                </button>

                {/* Description & Tags — revealed on open */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="relative z-10 px-6 md:px-14"
                  style={{
                    maxHeight: isOpen ? "220px" : "0",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    paddingLeft: "clamp(52px, 9vw, 110px)",
                    transition: isOpen
                      ? `max-height ${DUR} ${EASE}, opacity 0.6s 0.12s`
                      : `max-height 0.45s ${EASE}, opacity 0.25s`,
                  }}
                >
                  <div style={{ paddingLeft: "clamp(16px, 2vw, 32px)" }}>
                    <p
                      style={{
                        marginTop: "clamp(10px, 1.8vh, 18px)",
                        fontSize: "clamp(14px, 1.25vw, 17px)",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.65,
                        maxWidth: "52ch",
                        fontFamily: "var(--font-b)",
                      }}
                    >
                      {svc.description}
                    </p>

                    <div
                      className="flex flex-wrap gap-2"
                      style={{
                        marginTop: "clamp(14px, 2.2vh, 22px)",
                      }}
                    >
                      {svc.tags.map((tag, ti) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border font-mono uppercase"
                          style={{
                            padding: "6px 13px",
                            fontSize: "10px",
                            letterSpacing: "0.13em",
                            borderColor: `rgba(${a.rgb},0.22)`,
                            color: `rgba(${a.rgb},0.8)`,
                            background: `rgba(${a.rgb},0.05)`,
                            transform: isOpen
                              ? "translateY(0)"
                              : "translateY(10px)",
                            opacity: isOpen ? 1 : 0,
                            transition: `transform 0.55s ${EASE} ${0.22 + ti * 0.055}s, opacity 0.45s ${0.22 + ti * 0.055}s`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {svc.href && (
                      <div
                        style={{
                          marginTop: "clamp(14px, 2.2vh, 22px)",
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen
                            ? "translateY(0)"
                            : "translateY(10px)",
                          transition: `transform 0.55s ${EASE} 0.32s, opacity 0.45s 0.32s`,
                        }}
                      >
                        <Link
                          href={svc.href}
                          className="inline-flex items-center gap-2 rounded-full border font-mono uppercase"
                          style={{
                            padding: "10px 14px",
                            fontSize: "10px",
                            letterSpacing: "0.13em",
                            borderColor: `rgba(${a.rgb},0.35)`,
                            color: `rgba(${a.rgb},0.9)`,
                            background: `rgba(${a.rgb},0.07)`,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir {svc.title}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M4 10L10 4M10 4H5.5M10 4V8.5"
                              stroke={a.hex}
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ transition: "stroke 0.4s" }}
                            />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom separator */}
        <div
          className="exp-rule h-px mx-6 md:mx-14"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>

      {/* ── PROGRESS INDICATOR ── */}
      <div
        className="relative z-10 flex gap-1 mx-6 md:mx-14 mt-8"
        aria-hidden
      >
        {SERVICES.map((_, i) => (
          <div
            key={i}
            className="h-[2px] flex-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: active === i ? ACCENTS[i].hex : "transparent",
                transform: active === i ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform 0.7s ${EASE}, background 0.3s`,
                boxShadow:
                  active === i
                    ? `0 0 8px rgba(${ACCENTS[i].rgb},0.4)`
                    : "none",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
