"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePreloader } from "@/lib/preloader-context";

// ─── MANIFESTE — 3 mots, transition venetian blind, inversion finale ─────────
//
// Arc Eidos : percevoir ce qui échappe aux autres → structurer (forme) → durer.
// Mot 1 — PERCEVOIR. (blanc)
// Mot 2 — STRUCTURER. (accent bleu)
// Mot 3 — DURER. (inversion fond clair, texte sombre)
//
// ─────────────────────────────────────────────────────────────────────────────

const WORDS = [
  {
    text: "PERCEVOIR.",
    counter: "01 / 03",
    accented: false,
    inverted: false,
    rule: 0,
  },
  {
    text: "STRUCTURER.",
    counter: "02 / 03",
    accented: true,
    inverted: false,
    rule: 0.7,
  },
  {
    text: "DURER.",
    counter: "03 / 03",
    accented: false,
    inverted: true,
    rule: 0.4,
  },
] as const;

const ZONES = [
  { start: 0.0, end: 0.3 },
  { start: 0.3, end: 0.65 },
  { start: 0.65, end: 1.0 },
];

const N_SLICES = 12;
const TRANS_FRAC = 0.22;

const cl01 = (x: number) => Math.max(0, Math.min(1, x));
const sm = (e0: number, e1: number, x: number) => {
  const t = cl01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const slicesWrapRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isReady } = usePreloader();

  const [slicesBuilt, setSlicesBuilt] = useState(false);
  const lastWordRef = useRef(-1);
  const isTransitioningRef = useRef(false);

  const getCurBg = useCallback((wordIdx: number) => {
    return WORDS[wordIdx].inverted ? "var(--text)" : "var(--bg)";
  }, []);

  const switchWord = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (toIdx: number, gsapInstance: any) => {
      if (
        isTransitioningRef.current ||
        toIdx === lastWordRef.current ||
        toIdx < 0 ||
        toIdx >= WORDS.length
      )
        return;

      const fromIdx = lastWordRef.current >= 0 ? lastWordRef.current : 0;
      const toWord = WORDS[toIdx];
      isTransitioningRef.current = true;

      if (!wordRef.current || !stageRef.current || !counterRef.current)
        return;
      if (!slicesWrapRef.current || !ruleRef.current) return;

      // Mise à jour immédiate du mot (caché derrière les slices)
      wordRef.current.textContent = toWord.text;
      wordRef.current.classList.toggle("mf-accented", toWord.accented);
      counterRef.current.textContent = toWord.counter;

      // Inversion du stage
      if (toWord.inverted) {
        stageRef.current.classList.add("mf-inverted");
      } else {
        stageRef.current.classList.remove("mf-inverted");
      }

      // Couleur des slices = fond FROM
      const fromBg = getCurBg(fromIdx);
      sliceRefs.current.forEach((ref) => {
        if (ref) ref.style.background = fromBg;
      });

      // Afficher les slices
      slicesWrapRef.current.style.opacity = "1";
      ruleRef.current.style.width = "0";

      // Animation venetian blind avec GSAP
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      const DURATION = 0.75;
      const MAX_STAGGER = 0.12;

      const tl = gsapInstance.timeline({
        onComplete: () => {
          if (slicesWrapRef.current && ruleRef.current) {
            slicesWrapRef.current.style.opacity = "0";
            sliceRefs.current.forEach((ref) => {
              if (ref) gsapInstance.set(ref, { x: 0 });
            });
            isTransitioningRef.current = false;
            lastWordRef.current = toIdx;
            // Règle finale
            if (wordRef.current && toWord.rule > 0) {
              const ww = wordRef.current.offsetWidth;
              ruleRef.current.style.width = `${ww * toWord.rule}px`;
            }
          }
        },
      });

      sliceRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const dir = i % 2 === 0 ? 1 : -1;
        const stagger = (i / N_SLICES) * MAX_STAGGER;
        tl.to(
          ref,
          {
            x: dir * (vw + 20),
            duration: DURATION - stagger,
            ease: "power4.out",
            overwrite: true,
          },
          stagger
        );
      });
      lastWordRef.current = toIdx;
    },
    [getCurBg]
  );

  const updateRule = useCallback(
    (wordIdx: number, progress: number) => {
      const target = WORDS[wordIdx].rule;
      if (!ruleRef.current || !wordRef.current) return;
      if (target === 0) {
        ruleRef.current.style.width = "0";
        return;
      }
      const ww = wordRef.current.offsetWidth;
      const ruleW = ww * target * cl01(progress);
      ruleRef.current.style.width = `${ruleW}px`;

      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const fs =
        parseFloat(
          typeof window !== "undefined"
            ? getComputedStyle(wordRef.current).fontSize
            : "120"
        ) || 120;
      const lineH = fs * 1.0;
      ruleRef.current.style.top = `${vh * 0.5 + lineH * 0.5 + 14}px`;
      ruleRef.current.style.bottom = "auto";
    },
    []
  );

  useEffect(() => {
    if (!isReady) return;

    let ctx: gsap.Context | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);
      if (!sectionRef.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        if (wordRef.current && stageRef.current && counterRef.current) {
          wordRef.current.textContent = WORDS[0].text;
          counterRef.current.textContent = WORDS[0].counter;
          stageRef.current.classList.remove("mf-inverted");
        }
        if (slicesWrapRef.current) slicesWrapRef.current.style.display = "none";
        return;
      }

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;

            if (cueRef.current && p > 0.04) {
              cueRef.current.classList.add("mf-cue-gone");
            }

            let newWord = 0;
            for (let i = ZONES.length - 1; i >= 0; i--) {
              if (p >= ZONES[i].start) {
                newWord = i;
                break;
              }
            }

            if (newWord !== lastWordRef.current) {
              if (lastWordRef.current === -1 && newWord === 0) {
                if (wordRef.current && counterRef.current && stageRef.current) {
                  wordRef.current.textContent = WORDS[0].text;
                  counterRef.current.textContent = WORDS[0].counter;
                  stageRef.current.classList.remove("mf-inverted");
                }
                lastWordRef.current = 0;
              } else {
                switchWord(newWord, gsap);
              }
            }

            const zone = ZONES[newWord];
            const zoneLen = zone.end - zone.start;
            const inZone = (p - zone.start) / zoneLen;
            const ruleP = sm(TRANS_FRAC, TRANS_FRAC + 0.3, inZone);
            if (!isTransitioningRef.current) {
              updateRule(newWord, ruleP);
            }
          },
        });

        // Initial state
        if (wordRef.current && counterRef.current && stageRef.current) {
          wordRef.current.textContent = WORDS[0].text;
          counterRef.current.textContent = WORDS[0].counter;
          stageRef.current.classList.remove("mf-inverted");
        }
        lastWordRef.current = 0;
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, [isReady, switchWord, updateRule]);

  // Build slices on mount
  useEffect(() => {
    if (!slicesWrapRef.current) return;
    slicesWrapRef.current.innerHTML = "";
    sliceRefs.current = [];
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const sliceH = vh / N_SLICES;

    for (let i = 0; i < N_SLICES; i++) {
      const slice = document.createElement("div");
      slice.className = "mf-slice";
      slice.style.top = `${i * sliceH}px`;
      slice.style.height = `${sliceH}px`;

      const inner = document.createElement("div");
      inner.className = "mf-slice-inner";
      inner.style.background = getCurBg(0);
      slice.appendChild(inner);
      slicesWrapRef.current.appendChild(slice);
      (sliceRefs.current as (HTMLDivElement | null)[])[i] = inner as HTMLDivElement;
    }
    setSlicesBuilt(true);
  }, [getCurBg]);

  return (
    <section
      ref={sectionRef}
      id="manifeste"
      aria-label="Manifeste Eidos Studio"
      className="mf-section"
    >
      <p className="sr-only">
        Manifeste Eidos Studio : Exister. Fonctionner. Durer.
      </p>

      <div ref={stageRef} id="mf-stage" className="mf-stage">
        {/* Slices overlay — venetian blind */}
        <div
          ref={slicesWrapRef}
          id="mf-slices"
          className="mf-slices"
          aria-hidden
        />

        {/* Le mot */}
        <div id="mf-word" className="mf-word" aria-hidden>
          <span ref={wordRef} id="mf-word-inner" className="mf-word-inner">
            EXISTER.
          </span>
        </div>

        {/* Règle sous le mot */}
        <div ref={ruleRef} id="mf-rule" className="mf-rule" aria-hidden />

        {/* Compteur */}
        <div ref={counterRef} id="mf-counter" className="mf-counter" aria-hidden>
          01 / 03
        </div>

        {/* Scroll cue */}
        <div ref={cueRef} id="mf-cue" className="mf-cue" aria-hidden>
          <div className="mf-cue-bar" />
          <span className="mf-cue-txt">Défiler</span>
        </div>
      </div>
    </section>
  );
}
