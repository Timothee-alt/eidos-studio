"use client";

import { useEffect, useMemo, useState } from "react";

export type MinimapItem = { id: string; label: string };

type Props = {
  items: MinimapItem[];
};

export function ProjectCaseMinimap({ items }: Props) {
  const [active, setActive] = useState(0);

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (typeof window === "undefined" || !ids.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = els.indexOf(e.target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { root: null, rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.12, 0.25] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return (
    <nav
      className="pce-minimap"
      aria-label="Navigation dans l'étude de cas"
    >
      <ul className="pce-minimap-list">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`pce-minimap-dot${i === active ? " is-active" : ""}`}
              data-label={item.label}
              aria-current={i === active ? "location" : undefined}
              aria-label={`Aller à la section : ${item.label}`}
            >
              <span className="pce-minimap-sr" aria-hidden>
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
