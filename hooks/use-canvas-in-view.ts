"use client";

import { useEffect, useRef, useState } from "react";

type UseCanvasInViewOptions = {
  rootMargin?: string;
  threshold?: number;
};

/**
 * IntersectionObserver pour suspendre le rendu WebGL hors viewport.
 * État initial true : évite un flash avant le premier callback IO.
 */
export function useCanvasInView(options: UseCanvasInViewOptions = {}) {
  const { rootMargin = "120px 0px", threshold = 0 } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView } as const;
}
