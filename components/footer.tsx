export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-border px-6 py-8"
      aria-label="Pied de page"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 12% 100%, rgba(59,123,255,0.1) 0%, transparent 72%)",
        }}
      />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--muted)"
          style={{ fontFamily: "var(--font-m)" }}
        >
          © 2026 EIDOS STUDIO · STUDIO DIGITAL IMMERSIF
        </p>
        <p
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-(--green)"
          style={{ fontFamily: "var(--font-m)" }}
        >
          <span
            className="dot-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-(--green)"
            style={{ boxShadow: "0 0 6px var(--green)" }}
            aria-hidden
          />
          ouvert à de nouveaux projets
        </p>
      </div>
    </footer>
  );
}
