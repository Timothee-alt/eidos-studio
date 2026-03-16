"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { MOTION_TOKENS } from "@/lib/motion";

export type RevealVariant = "default" | "parallax" | "scale" | "blur";

/**
 * Hook useReveal — IntersectionObserver avec threshold 0.15.
 * Retourne un ref à attacher à l'élément.
 * Quand l'élément devient visible → ajoute la classe CSS "visible".
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Composant wrapper Reveal — applique useReveal et les classes CSS.
 * Variants: default (fadeUp), parallax (translateY léger), scale, blur
 */
export function Reveal({
  children,
  className = "",
  variant = "default",
  style,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  variant?: RevealVariant;
}) {
  const ref = useReveal<HTMLDivElement>();
  const variantClass =
    variant === "parallax"
      ? "reveal reveal--parallax"
      : variant === "scale"
        ? "reveal reveal--scale"
        : variant === "blur"
          ? "reveal reveal--blur"
          : "reveal";

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`.trim()}
      style={{
        "--motion-reveal-duration": `${MOTION_TOKENS.revealDuration}s`,
        "--motion-reveal-distance": `${MOTION_TOKENS.revealDistance}px`,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
