"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { SERVICES_SLIDES } from "@/lib/data";
import type { ServiceSlide } from "@/lib/data";
import { ServicesWebGL } from "@/components/services-webgl";

const CtaArrow = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
    <path
      d="M2 8L8 2M8 2H3.5M8 2V6.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ELEMENT_DELAYS = [
  { ey: 0.08, lead: 0.52, desc: 0.62, tags: 0.72, cta: 0.8 },
  { ey: 0.1, lead: 0.55, desc: 0.65, tags: 0.75, cta: 0.83 },
  { ey: 0.06, lead: 0.48, desc: 0.58, tags: 0.68, cta: 0.76 },
  { ey: 0.05, lead: 0.44, desc: 0.54, tags: 0.63, cta: 0.7 },
];

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

export function Services() {
  const [cur, setCur] = useState(0);
  const [hintGone, setHintGone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const mouseTargetRef = useRef<[number, number]>([0.5, 0.5]);
  const digitTrackRef = useRef<HTMLDivElement>(null);
  const idCharsRef = useRef<HTMLDivElement>(null);
  const idNameRef = useRef<HTMLSpanElement>(null);
  const idCodeRef = useRef<HTMLSpanElement>(null);
  const idScopeRef = useRef<HTMLSpanElement>(null);
  const idTagsRef = useRef<HTMLDivElement>(null);
  const panelGlowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const slides = SERVICES_SLIDES;
  const N = slides.length;

  const slideH = useCallback(() => {
    return rightRef.current?.clientHeight ?? window.innerHeight;
  }, []);

  const setStyle = useCallback(
    (el: HTMLElement | null | undefined, props: Record<string, string>) => {
      if (!el) return;
      Object.assign(el.style, props);
    },
    []
  );

  const goTo = useCallback(
    (next: number, instant = false) => {
      const nextIdx = Math.max(0, Math.min(N - 1, next));
      if (nextIdx === cur && !instant) return;
      if (isAnimating && !instant) return;

      const prev = cur;
      setCur(nextIdx);
      setIsAnimating(true);

      const from = -prev * slideH();
      const to = -nextIdx * slideH();
      const DURATION = instant ? 0 : 780;
      const start = performance.now();

      const slideEls = sectionRef.current?.querySelectorAll<HTMLElement>(".services-svc");
      if (!instant && slideEls?.[prev]) {
        exitSlide(slideEls[prev], prev);
      }

      function tick(now: number) {
        const elapsed = now - start;
        const progress = instant ? 1 : Math.min(elapsed / DURATION, 1);
        const eased = easeInOutQuart(progress);
        if (stripRef.current) {
          stripRef.current.style.transition = "none";
          stripRef.current.style.transform = `translateY(${from + (to - from) * eased}px)`;
        }
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          if (stripRef.current) {
            stripRef.current.style.transform = `translateY(${to}px)`;
          }
          setIsAnimating(false);
        }
      }
      requestAnimationFrame(tick);

      switchService(nextIdx, prev);
    },
    [cur, isAnimating, N, slideH]
  );

  const exitSlide = useCallback((slide: HTMLElement, idx: number) => {
    slide.classList.add("exiting");
    slide.classList.remove("live");

    const s = slides[idx];
    const rev = s.titleReveal ?? {
      initial: () => ({ transform: "translateY(106%)", opacity: "1" }),
      duration: [0.7, 0.7, 0.7],
      delay: [0, 0.07, 0.13],
    };

    slide.querySelectorAll(".services-t-word").forEach((w, wi) => {
      const init = rev.initial(wi);
      setStyle(w as HTMLElement, {
        ...init,
        transition: `transform 0.35s var(--ease) ${wi * 0.04}s, opacity 0.25s var(--ease) ${wi * 0.04}s`,
      });
    });

    [".services-svc-ey", ".services-svc-lead", ".services-svc-desc", ".services-svc-tags", ".services-svc-cta"].forEach(
      (sel, si) => {
        const el = slide.querySelector(sel);
        if (!el) return;
        setStyle(el as HTMLElement, {
          opacity: "0",
          transform: "translateY(-8px)",
          transition: `opacity 0.25s var(--ease) ${si * 0.03}s, transform 0.25s var(--ease) ${si * 0.03}s`,
        });
      }
    );

    setTimeout(() => slide.classList.remove("exiting"), 400);
  }, [slides, setStyle]);

  const revealSlide = useCallback(
    (slide: HTMLElement, idx: number) => {
      const s = slides[idx];
      const del = ELEMENT_DELAYS[idx];
      const rev = s.titleReveal ?? {
        initial: () => ({ transform: "translateY(106%)", opacity: "1" }),
        ease: "cubic-bezier(0.22,1,0.36,1)",
        duration: [0.85, 0.85, 0.85],
        delay: [0, 0.07, 0.13],
      };

      slide.classList.remove("exiting");
      slide.classList.add("live");

      const words = slide.querySelectorAll<HTMLElement>(".services-t-word");
      words.forEach((w, wi) => {
        const init = rev.initial(wi);
        setStyle(w, { ...init, transition: "none" });
      });

      void slide.offsetWidth;

      words.forEach((w, wi) => {
        setStyle(w, {
          transform: "translateY(0) translateX(0) skewX(0deg) scaleY(1)",
          opacity: "1",
          transition: `transform ${rev.duration[wi] ?? 0.7}s ${rev.ease} ${rev.delay[wi] ?? 0}s, opacity ${rev.duration[wi] ?? 0.7}s ${rev.ease} ${rev.delay[wi] ?? 0}s`,
        });
      });

      const ey = slide.querySelector<HTMLElement>(".services-svc-ey");
      setStyle(ey, { transform: "translateY(12px)", opacity: "0", transition: "none" });
      void ey?.offsetWidth;
      setStyle(ey, {
        transform: "translateY(0)",
        opacity: "1",
        transition: `transform 0.55s var(--ease) ${del.ey}s, opacity 0.5s var(--ease) ${del.ey}s`,
      });

      const elements: [HTMLElement | null, number][] = [
        [slide.querySelector<HTMLElement>(".services-svc-lead"), del.lead],
        [slide.querySelector<HTMLElement>(".services-svc-desc"), del.desc],
        [slide.querySelector<HTMLElement>(".services-svc-tags"), del.tags],
        [slide.querySelector<HTMLElement>(".services-svc-cta"), del.cta],
      ];
      elements.forEach(([el, d]) => {
        if (!el) return;
        setStyle(el, { transform: "translateY(14px)", opacity: "0", transition: "none" });
        void el.offsetWidth;
        setStyle(el, {
          transform: "translateY(0)",
          opacity: "1",
          transition: `transform 0.72s var(--ease) ${d}s, opacity 0.65s var(--ease) ${d}s`,
        });
      });
    },
    [slides, setStyle]
  );

  const applyColor = useCallback(
    (i: number, doFlash: boolean) => {
      const s = slides[i];
      if (!s) return;

      setStyle(panelGlowRef.current, {
        background: `radial-gradient(ellipse 300px 420px at -70px 55%, rgba(${s.rgb},0.2) 0%, transparent 68%)`,
        animationDuration: s.glowDur,
      });

      const digitNums = sectionRef.current?.querySelectorAll<HTMLElement>(".services-digit-num");
      digitNums?.forEach((d, j) => {
        if (j === i) {
          d.style.background = `linear-gradient(140deg,${s.hex} 0%,rgba(${s.rgb},0.52) 100%)`;
          d.style.webkitBackgroundClip = "text";
          d.style.webkitTextFillColor = "transparent";
          d.style.backgroundClip = "text";
        } else {
          d.style.background = "none";
          d.style.webkitTextFillColor = "rgba(246,246,247,0.05)";
        }
      });

      const progFill = sectionRef.current?.querySelector<HTMLElement>(".services-prog-fill");
      setStyle(progFill, {
        height: `${(i + 1) * 25}%`,
        background: s.hex,
      });

      const pulse = sectionRef.current?.querySelector<HTMLElement>(".services-id-pulse");
      setStyle(pulse, {
        background: s.hex,
        boxShadow: `0 0 8px rgba(${s.rgb},0.75)`,
      });

      setStyle(idScopeRef.current, {
        color: s.hex,
        borderColor: `rgba(${s.rgb},0.3)`,
      });

      const scrubDots = sectionRef.current?.querySelectorAll<HTMLElement>(".services-scrub-dot");
      scrubDots?.forEach((d, j) => {
        d.classList.toggle("active", j === i);
        d.style.background = j === i ? s.hex : "";
      });

      const h = sectionRef.current?.querySelector<HTMLElement>(".services-digit-frame")?.offsetHeight ?? 86;
      if (digitTrackRef.current) {
        digitTrackRef.current.style.transform = `translateY(-${i * h}px)`;
      }

      if (doFlash && flashRef.current) {
        flashRef.current.style.transition = "opacity 0s";
        flashRef.current.style.background = `rgba(${s.rgb},0.18)`;
        flashRef.current.style.opacity = "1";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (flashRef.current) {
              flashRef.current.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1)";
              flashRef.current.style.opacity = "0";
            }
          })
        );
      }
    },
    [slides, setStyle]
  );

  const buildChars = useCallback((text: string) => {
    if (!idCharsRef.current) return;
    while (idCharsRef.current.firstChild) {
      idCharsRef.current.removeChild(idCharsRef.current.firstChild);
    }
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = `services-id-char ${ch === " " ? "sp" : ""}`;
      span.textContent = ch === " " ? "\u00a0" : ch;
      span.style.transitionDelay = `${i * 21}ms`;
      idCharsRef.current!.appendChild(span);
    });
  }, []);

  const buildTags = useCallback((tags: string[]) => {
    if (!idTagsRef.current) return;
    while (idTagsRef.current.firstChild) {
      idTagsRef.current.removeChild(idTagsRef.current.firstChild);
    }
    tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "services-id-tag";
      span.textContent = tag;
      idTagsRef.current!.appendChild(span);
    });
  }, []);

  const revealChars = useCallback(() => {
    idCharsRef.current?.querySelectorAll(".services-id-char").forEach((c) => {
      (c as HTMLElement).style.transform = "translateY(0)";
      (c as HTMLElement).style.opacity = "1";
    });
  }, []);

  const hideChars = useCallback(() => {
    idCharsRef.current?.querySelectorAll(".services-id-char").forEach((c) => {
      (c as HTMLElement).style.transition = "none";
      (c as HTMLElement).style.transform = "translateY(100%)";
      (c as HTMLElement).style.opacity = "0";
    });
  }, []);

  const swapPanel = useCallback(
    (i: number) => {
      const s = slides[i];
      if (!idNameRef.current) return;

      idNameRef.current.style.transform = "translateY(-110%)";
      idNameRef.current.style.opacity = "0";
      hideChars();

      setTimeout(() => {
        if (idCodeRef.current) idCodeRef.current.textContent = s.code;
        if (idScopeRef.current) idScopeRef.current.textContent = s.scope;
        if (idNameRef.current) idNameRef.current.textContent = s.title;
        buildChars(s.quote);
        buildTags(s.tags);
        if (idNameRef.current) {
          idNameRef.current.style.transition = "none";
          idNameRef.current.style.transform = "translateY(110%)";
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              if (idNameRef.current) {
                idNameRef.current.style.transition = "transform 0.56s var(--snap), opacity 0.38s";
                idNameRef.current.style.transform = "translateY(0)";
                idNameRef.current.style.opacity = "1";
              }
            })
          );
        }
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            idCharsRef.current?.querySelectorAll(".services-id-char").forEach((c, ci) => {
              (c as HTMLElement).style.transition = `transform 0.38s var(--snap) ${ci * 0.021}s, opacity 0.28s ${ci * 0.021}s`;
            });
            revealChars();
          })
        );
      }, 170);
    },
    [slides, buildChars, buildTags, hideChars, revealChars]
  );

  const switchService = useCallback(
    (i: number, prev: number) => {
      applyColor(i, prev !== i);
      if (prev !== i) swapPanel(i);
      const slideEls = sectionRef.current?.querySelectorAll<HTMLElement>(".services-svc");
      setTimeout(() => {
        if (slideEls?.[i]) revealSlide(slideEls[i], i);
      }, 80);
      if (!hintGone && i !== 0) {
        setHintGone(true);
        scrollHintRef.current?.classList.add("gone");
      }
    },
    [applyColor, swapPanel, revealSlide, hintGone]
  );

  useEffect(() => {
    if (!stripRef.current) return;
    stripRef.current.style.height = `${N * 100}vh`;
    stripRef.current.style.transition = "none";
    stripRef.current.style.transform = "translateY(0)";
  }, [N]);

  useEffect(() => {
    const rightEl = rightRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!rightEl) return;
      const r = rightEl.getBoundingClientRect();
      mouseTargetRef.current[0] = (e.clientX - r.left) / r.width;
      mouseTargetRef.current[1] = 1.0 - (e.clientY - r.top) / r.height;
    };
    rightEl?.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => rightEl?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (stripRef.current) {
        stripRef.current.style.transition = "none";
        stripRef.current.style.transform = `translateY(-${cur * slideH()}px)`;
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [cur, slideH]);

  useEffect(() => {
    let wheelAccum = 0;
    let wheelCooldown = false;
    let exitAccum = 0; // scroll-up accumulé pour sortir du 01
    const EXIT_THRESHOLD = 140; // seuil plus élevé = moins sensible à la sortie

    const handleWheel = (e: WheelEvent) => {
      if (isAnimating || wheelCooldown) return;

      const scrollDown = e.deltaY > 0;
      const scrollUp = e.deltaY < 0;

      if (scrollDown && cur === N - 1) return;

      // Sur le slide 01 : exiger un scroll up délibéré avant de laisser sortir
      if (scrollUp && cur === 0) {
        exitAccum += Math.abs(e.deltaY);
        if (exitAccum < EXIT_THRESHOLD) {
          e.preventDefault();
          return;
        }
        exitAccum = 0;
        return; // laisser l'événement propager pour sortir
      }
      exitAccum = 0; // reset quand on change de direction ou de slide

      e.preventDefault();
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) >= 50) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        wheelCooldown = true;
        goTo(cur + dir);
        setTimeout(() => {
          wheelCooldown = false;
        }, 900);
      }
    };

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("wheel", handleWheel, { passive: false });
          } else {
            window.removeEventListener("wheel", handleWheel);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(section);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      observer.disconnect();
    };
  }, [cur, isAnimating, goTo, N]);

  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) {
        goTo(cur + (dy > 0 ? 1 : -1));
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cur, isAnimating, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(cur + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(cur - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cur, goTo]);

  useEffect(() => {
    const slideEls = sectionRef.current?.querySelectorAll<HTMLElement>(".services-svc");
    slideEls?.forEach((sl, i) => {
      const s = slides[i];
      const rev = s.titleReveal ?? {
        initial: () => ({ transform: "translateY(106%)", opacity: "1" }),
      };
      sl.querySelectorAll<HTMLElement>(".services-t-word").forEach((w, wi) => {
        const init = rev.initial(wi);
        Object.assign(w.style, init);
      });
      [".services-svc-ey", ".services-svc-lead", ".services-svc-desc", ".services-svc-tags", ".services-svc-cta"].forEach(
        (sel) => {
          const el = sl.querySelector<HTMLElement>(sel);
          if (el) {
            el.style.opacity = "0";
            el.style.transform = "translateY(14px)";
          }
        }
      );
    });
  }, [slides]);

  useEffect(() => {
    applyColor(0, false);
    buildChars(slides[0].quote);
    buildTags(slides[0].tags);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        revealChars();
        const firstSlide = sectionRef.current?.querySelector<HTMLElement>(".services-svc");
        if (firstSlide) revealSlide(firstSlide, 0);
      })
    );
  }, []);

  const activeSlide = slides[cur];

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="services-section"
      aria-label="Expertises"
    >
      <div className="services-glcanvas-wrap" aria-hidden>
        <ServicesWebGL
          slides={slides}
          activeIdx={cur}
          rightContainerRef={rightRef}
          mouseTargetRef={mouseTargetRef}
          sectionRef={sectionRef}
        />
      </div>
      <div ref={flashRef} className="services-flash" aria-hidden />

      <div className="services-shell">
        <aside className="services-panel">
          <div
            ref={panelGlowRef}
            className="services-panel-glow"
            aria-hidden
            style={{
              background: `radial-gradient(ellipse 300px 420px at -70px 55%, rgba(${activeSlide?.rgb ?? "59,123,255"},0.2) 0%, transparent 68%)`,
              animationDuration: activeSlide?.glowDur ?? "4s",
            }}
          />

          <div className="services-p-top">
            <p className="services-p-label">Expertises</p>
            <h2 className="services-p-heading">
              Ce qu&apos;on
              <br />
              fait
              <br />
              <em>de mieux.</em>
            </h2>
          </div>

          <div className="services-p-center">
            <div style={{ position: "relative" }}>
              <div className="services-digit-stage">
                <div ref={digitTrackRef} className="services-digit-track">
                  {slides.map((_, i) => (
                    <div key={i} className="services-digit-frame">
                      <span className="services-digit-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="services-prog-wrap">
                <div
                  className="services-prog-fill"
                  style={{
                    height: `${(cur + 1) * 25}%`,
                    background: activeSlide?.hex ?? "#3b7bff",
                  }}
                />
              </div>
            </div>

            <div className="services-identity">
              <div className="services-id-code-row">
                <div
                  className="services-id-pulse"
                  style={{
                    background: activeSlide?.hex ?? "#3b7bff",
                    boxShadow: `0 0 8px rgba(${activeSlide?.rgb ?? "59,123,255"},0.75)`,
                  }}
                />
                <span ref={idCodeRef} className="services-id-code">
                  {activeSlide?.code ?? "SVC-01"}
                </span>
                <span ref={idScopeRef} className="services-id-scope">
                  {activeSlide?.scope ?? "WebGL"}
                </span>
              </div>
              <div className="services-id-name-clip">
                <span ref={idNameRef} className="services-id-name">
                  {activeSlide?.title ?? ""}
                </span>
              </div>
              <div ref={idCharsRef} className="services-id-chars" />
              <div ref={idTagsRef} className="services-id-tags" />
            </div>
          </div>

          <div className="services-p-bottom">
            <div className="services-scrubber">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`services-scrub-dot ${i === cur ? "active" : ""}`}
                  data-to={i}
                  onClick={() => goTo(i)}
                  style={i === cur ? { background: activeSlide?.hex } : undefined}
                  aria-label={`Aller au service ${i + 1}`}
                />
              ))}
            </div>
            <div
              ref={scrollHintRef}
              className={`services-scroll-hint ${hintGone ? "gone" : ""}`}
            >
              <div className="services-hint-lw">
                <div className="services-hint-li" />
              </div>
              <span className="services-hint-txt">Défiler</span>
            </div>
          </div>
        </aside>

        <div ref={rightRef} className="services-right">
          <div ref={stripRef} className="services-strip">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`services-svc ${i === 0 ? "live" : ""}`}
                data-i={i}
                style={
                  {
                    "--sc": slide.hex,
                    "--glow-dur": slide.glowDur,
                  } as React.CSSProperties
                }
              >
                <div className="services-svc-ambient" aria-hidden />
                <div className="services-svc-bgnum" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="services-svc-inner">
                  <div className="services-svc-ey">
                    <span className="services-svc-scope">
                      {slide.scopeLabel}&nbsp;<strong>{slide.scopeQualifier}</strong>
                    </span>
                    <div className="services-ey-rule" />
                  </div>
                  <div className="services-title-block">
                    {slide.titleLines.map((line, li) => (
                      <div key={li} className="services-t-line">
                        <span
                          className={`services-t-word ${line.muted ? "services-t-mute" : ""}`}
                        >
                          {line.text}
                        </span>
                      </div>
                    ))}
                    {slide.vbadge && (
                      <span className="services-svc-vbadge">{slide.vbadge}</span>
                    )}
                  </div>
                  <div className="services-svc-div" />
                  <p className="services-svc-lead">{slide.lead}</p>
                  <p className="services-svc-desc">{slide.description}</p>
                  <div className="services-svc-tags">
                    {slide.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`services-svc-tag ${ti < slide.primaryTagCount ? "p" : ""}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {slide.href ? (
                    <Link
                      href={slide.href}
                      className="services-svc-cta"
                      data-cursor="view"
                      data-cursor-text="VOIR"
                    >
                      <span className="services-cta-label">{slide.ctaLabel}</span>
                      <div className="services-cta-rule" />
                      <div className="services-cta-circ">
                        <CtaArrow />
                      </div>
                    </Link>
                  ) : (
                    <div className="services-svc-cta">
                      <span className="services-cta-label">{slide.ctaLabel}</span>
                      <div className="services-cta-rule" />
                      <div className="services-cta-circ">
                        <CtaArrow />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
