import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060608; }
  @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse-ring { 0%,100% { opacity:0.4; transform: scale(1); } 50% { opacity:0.9; transform: scale(1.04); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scan-h { 0%,100%{transform:translateY(-200%);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(1200%);opacity:0} }
`;

// ─── CORE SYMBOL ─────────────────────────────────────────────────────────────
// The Eidos Eye: outer diamond + inner iris circle + pupil dot + crosshair lines
// Geometric, sharp, works at any size

function EidosSymbol({ size = 48, accent = "#3b7bff", animated = false, glowing = false }) {
  const cx = size / 2;
  const cy = size / 2;
  const outer = size * 0.46;   // diamond half-width
  const iris  = size * 0.22;   // iris radius
  const pupil = size * 0.07;   // pupil radius
  const cross = size * 0.30;   // crosshair length

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      style={{ display: "block", filter: glowing ? `drop-shadow(0 0 ${size*0.18}px ${accent}88)` : "none", transition: "filter 0.4s" }}>

      {/* Outer diamond */}
      <polygon
        points={`${cx},${cy - outer} ${cx + outer},${cy} ${cx},${cy + outer} ${cx - outer},${cy}`}
        stroke="white"
        strokeWidth={size * 0.028}
        fill="none"
        style={animated ? { animation: "pulse-ring 3s ease-in-out infinite" } : {}}
      />

      {/* Crosshair lines (subtle) */}
      <line x1={cx - cross} y1={cy} x2={cx - iris - size*0.04} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth={size*0.018} />
      <line x1={cx + iris + size*0.04} y1={cy} x2={cx + cross} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth={size*0.018} />
      <line x1={cx} y1={cy - cross} x2={cx} y2={cy - iris - size*0.04} stroke="rgba(255,255,255,0.25)" strokeWidth={size*0.018} />
      <line x1={cx} y1={cy + iris + size*0.04} x2={cx} y2={cy + cross} stroke="rgba(255,255,255,0.25)" strokeWidth={size*0.018} />

      {/* Iris ring */}
      <circle cx={cx} cy={cy} r={iris} stroke={accent} strokeWidth={size * 0.03} fill="none" />

      {/* Inner iris fill (very subtle) */}
      <circle cx={cx} cy={cy} r={iris * 0.7} fill={accent} opacity={0.08} />

      {/* Pupil */}
      <circle cx={cx} cy={cy} r={pupil} fill={accent} />

      {/* Corner ticks on diamond */}
      {[
        [cx, cy - outer],
        [cx + outer, cy],
        [cx, cy + outer],
        [cx - outer, cy],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={size * 0.025} fill="white" opacity={0.5} />
      ))}
    </svg>
  );
}

// ─── FULL LOCKUP ─────────────────────────────────────────────────────────────
function EidosLockup({ size = 48, accent = "#3b7bff", sub = null, glowing = false, style = {} }) {
  const textSize = size * 0.52;
  const subSize  = size * 0.22;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28, ...style }}>
      <EidosSymbol size={size} accent={accent} glowing={glowing} />
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: textSize,
          letterSpacing: "-0.04em",
          color: "white",
          lineHeight: 1,
        }}>EIDOS</div>
        {sub && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 400,
            fontSize: subSize,
            letterSpacing: "0.18em",
            color: accent,
            textTransform: "uppercase",
            marginTop: size * 0.06,
            lineHeight: 1,
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const BRANCHES = [
  {
    id: "STUDIO",
    label: "EIDOS STUDIO",
    sub: "STUDIO",
    accent: "#3b7bff",
    tagline: "Agence web & création digitale",
    desc: "Sites, apps, SaaS pour vos clients. Du code maintenu, pas juste livré.",
    tags: ["Next.js", "React", "UI/UX", "SaaS"],
    ref: "→ vercel.com / linear.app",
    feeling: "Sharp · Tech · Professionnel",
  },
  {
    id: "TECH",
    label: "EIDOS TECH",
    sub: "TECH",
    accent: "#a855f7",
    tagline: "Expérimentations & outils",
    desc: "Projets open source, IA, outils internes, explorations techniques.",
    tags: ["IA/ML", "OSS", "API", "CLI"],
    ref: "→ openai.com / anthropic.com",
    feeling: "Innovant · Exploratoire · Avant-garde",
  },
  {
    id: "HISTORIA",
    label: "EIDOS HISTORIA",
    sub: "HISTORIA",
    accent: "#d4a853",
    tagline: "Histoire & patrimoine numérique",
    desc: "Musées virtuels, projets pédagogiques, valorisation du patrimoine.",
    tags: ["Musée virtuel", "3D", "Pédagogie", "Arkeo"],
    ref: "→ arkeo-blush.vercel.app",
    feeling: "Intemporel · Culturel · Précieux",
  },
];

// ─── CARD ────────────────────────────────────────────────────────────────────
function BranchCard({ branch, delay = 0 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0a0a0a",
        border: `1px solid ${hovered ? branch.accent + "55" : "rgba(255,255,255,0.07)"}`,
        padding: "36px 32px 28px",
        cursor: "pointer",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
        boxShadow: hovered ? `0 0 40px ${branch.accent}18` : "none",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        position: "relative",
        animation: `fadeUp 0.6s ease ${delay}s both`,
      }}
    >
      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderWidth: "1.5px 0 0 1.5px" },
        { bottom: -1, right: -1, borderWidth: "0 1.5px 1.5px 0" },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 12, height: 12,
          borderStyle: "solid",
          borderColor: hovered ? branch.accent : "rgba(255,255,255,0.2)",
          transition: "border-color 0.3s",
          ...s,
        }} />
      ))}

      {/* Branch ID */}
      <div style={{
        position: "absolute", top: 14, right: 16,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.15)",
      }}>{branch.id}</div>

      {/* Logo lockup */}
      <div style={{ marginBottom: 28 }}>
        <EidosLockup size={44} accent={branch.accent} sub={branch.sub} glowing={hovered} />
      </div>

      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }} />

      {/* Tagline */}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 15, fontWeight: 600,
        color: hovered ? "white" : "rgba(255,255,255,0.8)",
        marginBottom: 10,
        transition: "color 0.2s",
      }}>{branch.tagline}</div>

      {/* Desc */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, lineHeight: 1.7,
        color: "rgba(255,255,255,0.35)",
        fontWeight: 300,
        marginBottom: 20,
      }}>{branch.desc}</p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {branch.tags.map(t => (
          <span key={t} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "0.06em",
            padding: "3px 8px",
            border: `1px solid ${hovered ? branch.accent + "44" : "rgba(255,255,255,0.1)"}`,
            color: hovered ? branch.accent : "rgba(255,255,255,0.35)",
            transition: "all 0.3s",
          }}>{t}</span>
        ))}
      </div>

      {/* Ref & feeling */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: branch.accent, opacity: hovered ? 0.8 : 0.4, transition: "opacity 0.3s", letterSpacing: "0.06em" }}>{branch.ref}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>{branch.feeling}</span>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#060608", padding: "56px 32px 80px", fontFamily: "'Syne', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* ── HERO SYMBOL ── */}
        <div style={{ textAlign: "center", marginBottom: 72, animation: "fadeUp 0.7s ease 0.1s both" }}>
          <div style={{ display: "inline-block", position: "relative", marginBottom: 40 }}>
            {/* Outer glow ring */}
            <div style={{
              position: "absolute", inset: -24,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(59,123,255,0.08) 0%, transparent 70%)",
              animation: "pulse-ring 4s ease-in-out infinite",
              pointerEvents: "none",
            }} />
            <EidosSymbol size={120} accent="#3b7bff" animated glowing />
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1,
            marginBottom: 12,
          }}>EIDOS</h1>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 20,
          }}>STUDIO · TECH · HISTORIA</div>

          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "rgba(255,255,255,0.25)",
            lineHeight: 1.7,
            maxWidth: 460,
            margin: "0 auto",
            fontStyle: "italic",
          }}>
            εἶδος — du grec : forme, essence, ce qui est visible.<br />
            Ce que vous voyez révèle ce que nous construisons.
          </p>
        </div>

        {/* ── SYMBOL BREAKDOWN ── */}
        <div style={{ marginBottom: 56, animation: "fadeUp 0.7s ease 0.2s both" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            marginBottom: 24,
          }}>[ ANATOMIE DU SYMBOLE ]</div>

          <div style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 40,
            alignItems: "center",
          }}>
            <EidosSymbol size={96} accent="#3b7bff" animated glowing />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
              {[
                { color: "white", label: "Losange extérieur", desc: "Précision · Structure · Cadre de travail" },
                { color: "#3b7bff", label: "Iris coloré", desc: "Vision · Identité · Couleur de branche" },
                { color: "rgba(255,255,255,0.3)", label: "Réticule croisillon", desc: "Rigueur · Analyse · Données" },
                { color: "white", label: "Pupille centrale", desc: "Focus · Expertise · Point de vérité" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SIZE VARIANTS ── */}
        <div style={{ marginBottom: 56, animation: "fadeUp 0.7s ease 0.25s both" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 24,
          }}>[ DÉCLINAISONS TAILLE ]</div>
          <div style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            gap: 40,
            flexWrap: "wrap",
          }}>
            {[64, 48, 32, 20, 14].map(s => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <EidosSymbol size={s} accent="#3b7bff" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{s}px</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", marginBottom: 6 }}>FAVICON</div>
              <div style={{
                width: 32, height: 32, background: "#060608",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <EidosSymbol size={20} accent="#3b7bff" />
              </div>
            </div>
          </div>
        </div>

        {/* ── BRANCHES ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 24,
            animation: "fadeUp 0.6s ease 0.3s both",
          }}>[ SYSTÈME DE BRANCHES ]</div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}>
            {BRANCHES.map((b, i) => <BranchCard key={b.id} branch={b} delay={0.35 + i * 0.1} />)}
          </div>
        </div>

        {/* ── NAV PREVIEW ── */}
        <div style={{ animation: "fadeUp 0.6s ease 0.65s both" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 20,
          }}>[ PREVIEW NAV — STUDIO ]</div>

          <div style={{
            background: "rgba(6,6,8,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "0 28px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <EidosLockup size={32} accent="#3b7bff" />
              <div style={{ display: "flex", gap: 28 }}>
                {["Work", "Services", "About", "Contact"].map(l => (
                  <span key={l} style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 12, fontWeight: 500,
              background: "#3b7bff",
              color: "white",
              padding: "7px 18px",
              cursor: "pointer",
            }}>Start a project →</div>
          </div>

          {/* Historia nav variant */}
          <div style={{
            background: "rgba(6,6,8,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: "none",
            padding: "0 28px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <EidosLockup size={32} accent="#d4a853" sub="HISTORIA" />
              <div style={{ display: "flex", gap: 28 }}>
                {["Explorer", "Catalogue", "Chercheurs"].map(l => (
                  <span key={l} style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 12, fontWeight: 500,
              background: "#d4a853",
              color: "#060608",
              padding: "7px 18px",
              cursor: "pointer",
            }}>Découvrir →</div>
          </div>

          {/* Tech nav variant */}
          <div style={{
            background: "rgba(6,6,8,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: "none",
            padding: "0 28px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <EidosLockup size={32} accent="#a855f7" sub="TECH" />
              <div style={{ display: "flex", gap: 28 }}>
                {["Projects", "OSS", "Lab"].map(l => (
                  <span key={l} style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 12, fontWeight: 500,
              background: "#a855f7",
              color: "white",
              padding: "7px 18px",
              cursor: "pointer",
            }}>Explore →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
