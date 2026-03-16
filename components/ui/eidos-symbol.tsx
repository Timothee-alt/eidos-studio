"use client";

import { forwardRef } from "react";

/* ────────────────────────────────────────────────────────────
   EidosSymbol — The Eidos Eye
   Losange extérieur + iris + pupille + réticule croisillon
   Animation signature "Iris open" : scale diamond, iris radius 0→1, pupil fade
   D'après eidos-spec.txt section 6 — 1.2s, cubic-bezier(0.16, 1, 0.3, 1)
   ──────────────────────────────────────────────────────────── */

export interface EidosSymbolProps {
  size?: number;
  accent?: string;
  animated?: boolean;
  glowing?: boolean;
  /** Animation Iris open au load — déclenchée après le texte hero */
  irisOpen?: boolean;
  className?: string;
}

export const EidosSymbol = forwardRef<SVGSVGElement, EidosSymbolProps>(
  function EidosSymbol(
    {
      size = 48,
      accent = "#3b7bff",
      animated = false,
      glowing = false,
      irisOpen = false,
      className = "",
    },
    ref
  ) {
    const cx = size / 2;
    const cy = size / 2;
    const outer = size * 0.46; // diamond half-width
    const iris = size * 0.22; // iris radius
    const pupil = size * 0.07; // pupil radius
    const cross = size * 0.3; // crosshair length

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`eidos-symbol ${animated ? "eidos-symbol--animated" : ""} ${glowing ? "eidos-symbol--glowing" : ""} ${irisOpen ? "eidos-symbol--iris-open" : ""} ${className}`}
        style={{
          display: "block",
          filter: glowing ? `drop-shadow(0 0 ${size * 0.18}px ${accent}88)` : "none",
          transition: "filter 0.4s",
          ["--eidos-accent" as string]: accent,
        }}
        aria-hidden
      >
        {/* Outer diamond — scale 0.8 → 1 */}
        <g className={irisOpen ? "eidos-iris-diamond" : undefined}>
          <polygon
            points={`${cx},${cy - outer} ${cx + outer},${cy} ${cx},${cy + outer} ${cx - outer},${cy}`}
            stroke="white"
            strokeWidth={size * 0.028}
            fill="none"
            className={animated ? "eidos-symbol-diamond" : undefined}
          />
        </g>

        {/* Crosshair lines (subtle) */}
        <line
          x1={cx - cross}
          y1={cy}
          x2={cx - iris - size * 0.04}
          y2={cy}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={size * 0.018}
        />
        <line
          x1={cx + iris + size * 0.04}
          y1={cy}
          x2={cx + cross}
          y2={cy}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={size * 0.018}
        />
        <line
          x1={cx}
          y1={cy - cross}
          x2={cx}
          y2={cy - iris - size * 0.04}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={size * 0.018}
        />
        <line
          x1={cx}
          y1={cy + iris + size * 0.04}
          x2={cx}
          y2={cy + cross}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={size * 0.018}
        />

        {/* Iris ring + fill — scale 0 → 1 (pupille qui s'ouvre) */}
        <g className={irisOpen ? "eidos-iris-ring" : undefined}>
          <circle
            cx={cx}
            cy={cy}
            r={iris}
            stroke={accent}
            strokeWidth={size * 0.03}
            fill="none"
          />
          <circle cx={cx} cy={cy} r={iris * 0.7} fill={accent} opacity={0.08} />
        </g>

        {/* Pupil — fade in delay 0.6s */}
        <circle
          cx={cx}
          cy={cy}
          r={pupil}
          fill={accent}
          className={irisOpen ? "eidos-iris-pupil" : undefined}
        />

        {/* Corner ticks on diamond */}
        {[
          [cx, cy - outer],
          [cx + outer, cy],
          [cx, cy + outer],
          [cx - outer, cy],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={size * 0.025}
            fill="white"
            opacity={0.5}
          />
        ))}
      </svg>
    );
  }
);

/* ────────────────────────────────────────────────────────────
   EidosLockup — Symbole + wordmark EIDOS (Syne 800) + sous-label mono
   D'après eidos-logo-system.jsx
   ──────────────────────────────────────────────────────────── */

export type EidosSubLabel = "STUDIO" | "TECH" | "HISTORIA" | (string & {});

export interface EidosLockupProps {
  size?: number;
  accent?: string;
  animated?: boolean;
  glowing?: boolean;
  subLabel?: EidosSubLabel;
  className?: string;
}

export function EidosLockup({
  size = 48,
  accent = "#3b7bff",
  animated = false,
  glowing = false,
  subLabel,
  className = "",
}: EidosLockupProps) {
  const textSize = size * 0.52;
  const subSize = size * 0.22;

  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        gap: size * 0.28,
        fontFamily: "var(--font-d)",
      }}
    >
      <EidosSymbol
        size={size}
        accent={accent}
        animated={animated}
        glowing={glowing}
        className="shrink-0"
      />
      <div className="flex flex-col">
        <span
          style={{
            fontFamily: "var(--font-d)",
            fontWeight: 800,
            fontSize: textSize,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1,
          }}
        >
          EIDOS
        </span>
        {subLabel && (
          <span
            style={{
              fontFamily: "var(--font-m)",
              fontWeight: 400,
              fontSize: subSize,
              letterSpacing: "0.18em",
              color: accent,
              textTransform: "uppercase",
              marginTop: size * 0.06,
              lineHeight: 1,
            }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
