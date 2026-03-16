"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { MOTION_TOKENS } from "@/lib/motion";

export type ScrollRevealVariant =
  | "words"
  | "chars"
  | "fade"
  | "clip"
  | "line";

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

export function ScrollReveal({
  children,
  variant = "fade",
  className = "",
  as: Component = "div",
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let splitInstance: { revert: () => void } | null = null;
    let ctx: { revert: () => void } | null = null;
    let isCancelled = false;

    const run = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;

      const baseTrigger = {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      };

      ctx = gsap.context(async () => {
        if (prefersReducedMotion) {
          gsap.set(el, { opacity: 1, y: 0, clipPath: "inset(0)" });
          gsap.set(el.querySelectorAll("[data-line-seg]"), { yPercent: 0, opacity: 1 });
          return;
        }

        switch (variant) {
          case "words":
          case "chars": {
            const text = (el.textContent ?? "").trim();
            if (!text) return;
            const { default: SplitType } = await import("split-type");
            splitInstance = new SplitType(el, {
              types: variant === "words" ? "words" : "chars",
              tagName: "span",
            }) as { revert: () => void };
            const targets = variant === "words"
              ? el.querySelectorAll(".word")
              : el.querySelectorAll(".char");
            gsap.fromTo(
              targets,
              { yPercent: 105, opacity: 0.01 },
              {
                yPercent: 0,
                opacity: 1,
                duration: MOTION_TOKENS.revealDuration,
                stagger:
                  variant === "words"
                    ? MOTION_TOKENS.splitWordsStagger
                    : MOTION_TOKENS.splitCharsStagger,
                ease: MOTION_TOKENS.easeOut,
                scrollTrigger: baseTrigger,
              }
            );
            break;
          }
          case "line": {
            gsap.fromTo(
              el.querySelectorAll("[data-line-seg]"),
              { yPercent: 105 },
              {
                yPercent: 0,
                duration: MOTION_TOKENS.lineDuration,
                stagger: MOTION_TOKENS.lineStagger,
                ease: MOTION_TOKENS.easeOut,
                scrollTrigger: baseTrigger,
              }
            );
            break;
          }
          case "clip": {
            gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
            gsap.to(el, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.1,
              ease: MOTION_TOKENS.easeOut,
              scrollTrigger: baseTrigger,
            });
            break;
          }
          case "fade":
          default: {
            gsap.fromTo(
              el,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: MOTION_TOKENS.revealDuration,
                ease: MOTION_TOKENS.easeSoft,
                scrollTrigger: baseTrigger,
              }
            );
            break;
          }
        }
      }, el);

      if (isCancelled) {
        ctx.revert();
      }
    };

    run();

    return () => {
      isCancelled = true;
      if (ctx) ctx.revert();
      if (splitInstance) splitInstance.revert();
    };
  }, [children, variant, prefersReducedMotion]);

  const Comp = Component as "div";
  const lineChildren =
    variant === "line" && typeof children === "string"
      ? children
          .split("\n")
          .filter(Boolean)
          .map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-line-seg className="block">
                {line}
              </span>
            </span>
          ))
      : children;

  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {lineChildren}
    </Comp>
  );
}
