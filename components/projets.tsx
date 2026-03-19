"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PROJECT_SLIDES } from "@/lib/data";

export function Projects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLElement[]>([]);
  const pipsRef = useRef<HTMLDivElement>(null);
  const ctrRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const N = PROJECT_SLIDES.length;
  const [isMobile, setIsMobile] = useState(false);
  const [isFine, setIsFine] = useState(true);

  useEffect(() => {
    const mm = window.matchMedia("(max-width:768px)");
    const pf = window.matchMedia("(pointer:fine)");
    setIsMobile(mm.matches);
    setIsFine(pf.matches);

    const onResize = () => setIsMobile(mm.matches);
    mm.addEventListener("change", onResize);
    return () => mm.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const strip = stripRef.current;
    const panels = panelsRef.current.filter(Boolean);
    const pipsEl = pipsRef.current;
    const ctrEl = ctrRef.current;
    const hintEl = hintRef.current;

    if (!root || !strip || panels.length === 0) return;

    const setHeight = () => {
      if (!isMobile && root) (root as HTMLDivElement).style.height = `${N * 100}vh`;
    };
    setHeight();

    const pips = pipsEl ? [...pipsEl.querySelectorAll<HTMLDivElement>(".pip")] : [];
    let currentIdx = 0;
    let targetX = 0;
    let currentX = 0;
    let rafRunning = false;
    let hintGone = false;
    const countupDone = new Set<HTMLElement>();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function countup(panel: HTMLElement) {
      if (countupDone.has(panel)) return;
      countupDone.add(panel);

      const raw = parseFloat(panel.dataset.resRaw ?? "0");
      const prefix = panel.dataset.resPrefix ?? "";
      const suffix = panel.dataset.resSuffix ?? "";
      const step = parseFloat(panel.dataset.resStep ?? "1");
      const valEl = panel.querySelector<HTMLSpanElement>(".pp-res-val");
      if (!valEl) return;

      const DURATION = 1200;
      const start = performance.now();

      function tick(now: number) {
        const t = Math.min((now - start) / DURATION, 1);
        const e = 1 - Math.pow(1 - t, 4);
        const v = e * raw;
        const disp = step < 1 ? v.toFixed(1) : Math.round(v);
        valEl!.textContent = prefix + disp + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else valEl!.textContent = prefix + raw + suffix;
      }
      requestAnimationFrame(tick);
    }

    function animStrip() {
      if (!rafRunning || !strip) return;
      currentX = lerp(currentX, targetX, 0.14);
      strip.style.transform = `translateX(${-currentX}px)`;
      const diff = Math.abs(currentX - targetX);
      if (diff > 0.3) requestAnimationFrame(animStrip);
      else {
        currentX = targetX;
        strip.style.transform = `translateX(${-currentX}px)`;
        rafRunning = false;
      }
    }

    function kickRaf() {
      if (!rafRunning) {
        rafRunning = true;
        requestAnimationFrame(animStrip);
      }
    }

    function onScroll() {
      if (isMobile) return;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(total, 1)));

      targetX = p * (N - 1) * window.innerWidth;
      kickRaf();

      const inSection = rect.top <= 0 && rect.bottom >= window.innerHeight;
      pipsEl?.classList.toggle("on", inSection);
      ctrEl?.classList.toggle("on", inSection);

      const floatIdx = p * (N - 1);
      const snapIdx = Math.max(0, Math.min(N - 1, Math.round(floatIdx)));

      if (snapIdx !== currentIdx) {
        currentIdx = snapIdx;
        pips.forEach((pip, i) => pip.classList.toggle("active", i === snapIdx));
        if (ctrEl) ctrEl.textContent = `${String(snapIdx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      }

      panels.forEach((panel, i) => {
        const dist = Math.abs(floatIdx - i);
        const wasActive = panel.classList.contains("active");
        const isActive = dist < 0.55;
        panel.classList.toggle("active", isActive);

        if (isActive && !wasActive) {
          paraX = 0;
          paraY = 0;
          const img = panel.querySelector<HTMLDivElement>(".pp-img");
          if (img) img.style.transform = panel.dataset.kbTo ?? "";
          setTimeout(() => countup(panel), 400);
        }

        if (!isActive && wasActive) {
          countupDone.delete(panel);
          const valEl = panel.querySelector<HTMLSpanElement>(".pp-res-val");
          if (valEl) {
            const prefix = panel.dataset.resPrefix ?? "";
            const suffix = panel.dataset.resSuffix ?? "";
            valEl.textContent = prefix + "0" + suffix;
          }
          const img = panel.querySelector<HTMLDivElement>(".pp-img");
          if (img) {
            img.style.transition = "none";
            img.style.transform = panel.dataset.kbFrom ?? "";
            setTimeout(() => {
              img.style.transition = `transform ${panel.dataset.kbDur}s cubic-bezier(0.25,0.46,0.45,0.94)`;
            }, 50);
          }
        }
      });

      if (!hintGone && p > 0.004 && hintEl) {
        hintGone = true;
        hintEl.classList.add("gone");
      }
    }

    /* Mouse parallax — para layer shifts with cursor, clamped to avoid bleed */
    const PARA_OVERLAP = 60;
    const PARA_MAX_X = 14;
    const PARA_MAX_Y = 10;
    let paraX = 0;
    let paraY = 0;
    let paraTargetX = 0;
    let paraTargetY = 0;

    let paraRafId: number | undefined;
    const onMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      let tx = rx * PARA_MAX_X;
      let ty = ry * PARA_MAX_Y;
      if (Math.abs(tx) + PARA_MAX_X > PARA_OVERLAP)
        tx = tx > 0 ? PARA_OVERLAP - PARA_MAX_X : -(PARA_OVERLAP - PARA_MAX_X);
      if (Math.abs(ty) + PARA_MAX_Y > PARA_OVERLAP)
        ty = ty > 0 ? PARA_OVERLAP - PARA_MAX_Y : -(PARA_OVERLAP - PARA_MAX_Y);
      paraTargetX = tx;
      paraTargetY = ty;
    };

    if (isFine) {
      document.addEventListener("mousemove", onMouseMove, { passive: true });

      (function paraRaf() {
        paraRafId = requestAnimationFrame(paraRaf);
        paraX += (paraTargetX - paraX) * 0.06;
        paraY += (paraTargetY - paraY) * 0.06;
        panels.forEach((p) => {
          if (p.classList.contains("active")) {
            const para = p.querySelector<HTMLDivElement>(".pp-para");
            if (para) para.style.transform = `translate(${paraX}px, ${paraY}px)`;
          }
        });
      })();
    }

    /* Keyboard: scroll strip to focused panel when CTA receives focus */
    function scrollToPanel(idx: number) {
      if (!root || isMobile) return;
      const total = root.offsetHeight - window.innerHeight;
      const p = N > 1 ? Math.max(0, Math.min(1, idx / (N - 1))) : 0;
      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = rootTop + p * total;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }

    const focusCleanups: (() => void)[] = [];
    panels.forEach((panel, idx) => {
      const cta = panel.querySelector<HTMLAnchorElement>("a.pp-cta");
      if (cta) {
        const handler = () => scrollToPanel(idx);
        cta.addEventListener("focus", handler);
        focusCleanups.push(() => cta.removeEventListener("focus", handler));
      }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      setHeight();
      currentX = targetX;
      if (strip) (strip as HTMLDivElement).style.transform = `translateX(${-currentX}px)`;
    });

    const footerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) footerRef.current?.classList.add("vis");
        });
      },
      { threshold: 0.3 }
    );
    if (footerRef.current) footerObs.observe(footerRef.current);

    const stickyEl = stickyRef.current;
    const entryObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && stickyEl) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                stickyEl.classList.add("entered");
              });
            });
          }
        });
      },
      { threshold: 0 }
    );
    entryObs.observe(root);

    if (isMobile) {
      const mobObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const panel = e.target as HTMLDivElement;
            const wasActive = panel.classList.contains("active");
            if (e.isIntersecting && !wasActive) {
              panel.classList.add("active");
              const img = panel.querySelector<HTMLDivElement>(".pp-img");
              if (img) img.style.transform = panel.dataset.kbTo ?? "";
              setTimeout(() => countup(panel), 350);
            }
          });
        },
        { threshold: 0.45 }
      );
      panels.forEach((p) => mobObs.observe(p));
    }

    panels[0]?.classList.add("active");
    const img0 = panels[0]?.querySelector<HTMLDivElement>(".pp-img");
    setTimeout(() => {
      if (img0) img0.style.transform = panels[0].dataset.kbTo ?? "";
      countup(panels[0]);
    }, 200);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      focusCleanups.forEach((fn) => fn());
      if (isFine) {
        document.removeEventListener("mousemove", onMouseMove);
        if (paraRafId != null) cancelAnimationFrame(paraRafId);
      }
      footerObs.disconnect();
      entryObs.disconnect();
    };
  }, [N, isMobile]);

  return (
    <section
      id="projets"
      className="projects-section relative"
      aria-label="Projets sélectionnés"
    >
      <div className="projects-pips" ref={pipsRef} aria-hidden>
        {PROJECT_SLIDES.map((_, i) => (
          <div key={i} className={`pip${i === 0 ? " active" : ""}`} />
        ))}
      </div>
      <div className="projects-ctr" ref={ctrRef} aria-hidden>
        01 / {String(N).padStart(2, "0")}
      </div>
      <div className="projects-hint" ref={hintRef} aria-hidden>
        <span className="hint-txt">
          Défiler <span className="hint-arr">→</span>
        </span>
      </div>

      <div className="projects-hdr reveal">
        <div>
          <p className="ph-label">Projets sélectionnés</p>
          <h2 className="ph-title">
            Ce qu&apos;on a
            <br />
            <em>construit.</em>
          </h2>
        </div>
        <p className="ph-right">
          Chaque projet
          <br />
          est une transformation.
        </p>
      </div>

      <div className="projects-root" ref={rootRef} aria-label="Projets — navigation horizontale">
        <div className="projects-sticky" ref={stickyRef}>
          <div className="projects-strip" ref={stripRef} role="list">
            {PROJECT_SLIDES.map((project, idx) => (
              <article
                key={project.id}
                ref={(el) => {
                  if (el) panelsRef.current[idx] = el;
                }}
                className="pp"
                role="listitem"
                style={{ "--pp-pc": project.hex } as React.CSSProperties}
                data-img={project.image}
                data-kb-from={project.kbFrom}
                data-kb-to={project.kbTo}
                data-kb-dur={project.kbDur}
                data-grad={project.grad}
                data-res-raw={project.resRaw}
                data-res-prefix={project.resPrefix}
                data-res-suffix={project.resSuffix}
                data-res-label={project.resLabel}
                data-res-step={project.resStep}
                aria-label={project.title}
              >
                <div
                  className="pp-img"
                  aria-hidden
                  style={{
                    background: project.image
                      ? `url(${project.image}) center/cover no-repeat`
                      : project.gradientBg ?? "#050507",
                    transform: project.kbFrom,
                    transition: `transform ${project.kbDur}s cubic-bezier(0.25,0.46,0.45,0.94)`,
                  }}
                />
                <div
                  className="pp-para"
                  aria-hidden
                  style={{
                    background: project.image
                      ? `url(${project.image}) center/cover no-repeat`
                      : "transparent",
                  }}
                />
                <div
                  className="pp-grad"
                  aria-hidden
                  style={{ background: project.grad }}
                />
                <div className="pp-top">
                  <span className="pp-idx" aria-hidden>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="pp-cats">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="pp-cat">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pp-inner">
                  <div className="pp-body">
                    <span className="pp-client">{project.client}</span>
                    <div className="pp-title-clip">
                      <span className="pp-title">
                        {project.titleLines ? (
                          <>
                            {project.titleLines[0]}
                            <br />
                            {project.titleLines[1]}
                          </>
                        ) : (
                          project.title
                        )}
                      </span>
                    </div>
                    <div className="pp-foot">
                      <div className="pp-res">
                        <span className="pp-res-val">
                          {project.resPrefix}0{project.resSuffix}
                        </span>
                        <span className="pp-res-lbl">{project.resLabel}</span>
                      </div>
                      <Link
                        href={project.href}
                        className="pp-cta"
                        data-cursor="view"
                        data-cursor-text="VOIR"
                        aria-label={`Voir l'étude de cas ${project.title}`}
                      >
                        <span className="pp-cta-txt">Voir l&apos;étude de cas</span>
                        <div className="pp-cta-rule" />
                        <div className="pp-cta-circ">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 10 10"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M2 8L8 2M8 2H3.5M8 2V6.5"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-footer" ref={footerRef}>
        <span className="pf-note">
          {N} projets · Lannion · Bretagne · France
        </span>
        <Link
          href="/projets"
          className="pf-cta"
          aria-label="Voir tous les projets"
        >
          <span className="pf-lbl">Tous les projets</span>
          <div className="pf-rule" />
          <div className="pf-circ">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 8L8 2M8 2H3.5M8 2V6.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
