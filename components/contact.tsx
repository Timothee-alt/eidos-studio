"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/data";
import { EidosSymbol } from "@/components/ui/eidos-symbol";

// ─── TextScramble ─────────────────────────────────────────────────────────────
class TextScramble {
  private el: HTMLElement;
  private chars = "!<>-_\\/[]{}—=+*^?#░▒▓ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private resolve!: () => void;
  private frameRequest!: number;
  private frame = 0;
  private queue: { from: string; to: string; start: number; end: number; char: string }[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string): Promise<void> {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((r) => (this.resolve = r));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] ?? "";
      const to = newText[i] ?? "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 16) + 6;
      this.queue.push({ from, to, start, end, char: "" });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update() {
    let output = "";
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const { from, to, start, end } = this.queue[i];
      let { char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:#3b7bff;opacity:0.65">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}
// ──────────────────────────────────────────────────────────────────────────────

type FormState = "idle" | "sending" | "sent";
type Fields = { name: string; type: string; message: string };

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);
  const scrambleBusyRef = useRef(false);

  const [formState, setFormState] = useState<FormState>("idle");
  const [copied, setCopied] = useState(false);
  const [fields, setFields] = useState<Fields>({ name: "", type: "", message: "" });

  // ── Init scrambler + auto-scramble on section enter ─────────────────────────
  useEffect(() => {
    if (emailRef.current) {
      scramblerRef.current = new TextScramble(emailRef.current);
    }

    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && scramblerRef.current && !scrambleBusyRef.current) {
            setTimeout(() => {
              if (scramblerRef.current && !scrambleBusyRef.current) {
                scrambleBusyRef.current = true;
                scramblerRef.current.setText(CONTACT_EMAIL).then(() => {
                  scrambleBusyRef.current = false;
                });
              }
            }, 800);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(section);

    return () => io.disconnect();
  }, []);

  // ── Click-to-copy ───────────────────────────────────────────────────────────
  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, []);

  // ── Email scramble on mouse enter ───────────────────────────────────────────
  const handleEmailMouseEnter = useCallback(() => {
    const sc = scramblerRef.current;
    if (!sc || scrambleBusyRef.current) return;
    scrambleBusyRef.current = true;
    sc.setText(CONTACT_EMAIL).then(() => {
      scrambleBusyRef.current = false;
    });
  }, []);

  // ── GSAP scroll animations ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let ctx: { revert(): void } | undefined;

    Promise.all([
      import("gsap").then((m) => m.default),
      import("gsap/ScrollTrigger").then((m) => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const section = sectionRef.current;
      if (!section) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        if (reduced) {
          gsap.set("[data-ct]", { opacity: 1, y: 0, x: 0, clipPath: "none", scaleX: 1 });
          return;
        }

        const st = (trigger: string, start = "top 82%") => ({
          scrollTrigger: { trigger: section.querySelector(trigger) ?? trigger, start },
        });

        // Section label
        gsap.from("[data-ct='label']", {
          opacity: 0, y: 10, duration: 0.9, ease: "power3.out", ...st("[data-ct='label']"),
        });

        // Big background number
        gsap.from("[data-ct='bg-num']", {
          opacity: 0, y: 40, duration: 1.4, ease: "expo.out", ...st("[data-ct='bg-num']", "top 90%"),
        });

        // Headline lines — clip-path reveal (no overflow-hidden needed)
        gsap.fromTo("[data-ct='hl-1']",
          { clipPath: "inset(0 0 110% 0)", y: 20 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.3, ease: "expo.out",
            scrollTrigger: { trigger: section.querySelector("[data-ct='hl-1']"), start: "top 82%" } }
        );
        gsap.fromTo("[data-ct='hl-2']",
          { clipPath: "inset(0 0 110% 0)", y: 20 },
          { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.3, delay: 0.1, ease: "expo.out",
            scrollTrigger: { trigger: section.querySelector("[data-ct='hl-2']"), start: "top 82%" } }
        );

        // Tagline
        gsap.from("[data-ct='tagline']", {
          opacity: 0, y: 22, duration: 1, ease: "power3.out", delay: 0.2,
          ...st("[data-ct='tagline']"),
        });

        // Email block
        gsap.from("[data-ct='email']", {
          opacity: 0, y: 18, duration: 0.9, ease: "power3.out",
          ...st("[data-ct='email']", "top 88%"),
        });

        // Social links
        gsap.from("[data-ct='social']", {
          opacity: 0, x: -14, duration: 0.7, stagger: 0.09, ease: "power3.out",
          ...st("[data-ct='social']", "top 88%"),
        });

        // Form fields
        gsap.from("[data-ct='field']", {
          opacity: 0, y: 28, duration: 0.9, stagger: 0.1, ease: "power3.out",
          ...st("[data-ct='field']", "top 80%"),
        });

        // Submit button
        gsap.from("[data-ct='submit']", {
          opacity: 0, scale: 0.85, duration: 1, ease: "expo.out", delay: 0.3,
          ...st("[data-ct='submit']", "top 80%"),
        });

        // Bottom rule
        gsap.from("[data-ct='rule']", {
          scaleX: 0, duration: 1.4, ease: "expo.out", transformOrigin: "left center",
          ...st("[data-ct='rule']", "top 96%"),
        });
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (formState !== "idle") return;
      setFormState("sending");
      // Replace with your real API endpoint
      await new Promise((r) => setTimeout(r, 1800));
      setFormState("sent");
    },
    [formState],
  );

  const resetForm = () => {
    setFormState("idle");
    setFields({ name: "", type: "", message: "" });
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact — Eidos Studio"
      className="relative w-full bg-[#050507] overflow-hidden text-[#f6f6f7]"
    >
      {/* ── Grain texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.032] mix-blend-screen"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />

      {/* ── Accent top line ── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.08) 60%, transparent 100%)",
        }}
      />

      {/* ── EidosSymbol watermark ── */}
      <div
        aria-hidden
        className="absolute bottom-[-8%] left-[-8%] opacity-[0.022] pointer-events-none z-0"
      >
        <EidosSymbol size={700} animated={false} />
      </div>

      {/* ── Background section number ── */}
      <div
        aria-hidden
        data-ct="bg-num"
        className="pointer-events-none absolute top-8 z-0 select-none [right:max(env(safe-area-inset-right,0px),var(--page-gutter))]"
        style={{
          fontFamily: "var(--font-d)",
          fontSize: "clamp(120px, 18vw, 280px)",
          fontWeight: 800,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.04)",
          letterSpacing: "-0.06em",
        }}
      >
        04
      </div>

      {/* ── Main container ── */}
      <div className="page-content relative z-10 pt-24 pb-16 md:pt-32 md:pb-20">

        {/* ── Header row ── */}
        <div
          data-ct="label"
          className="flex items-center justify-between border-b border-white/8 pb-6 mb-20 md:mb-28"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
            04 / Contact
          </span>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="dot-pulse w-1.5 h-1.5 rounded-full bg-[#68e2a0]"
              style={{ boxShadow: "0 0 6px #68e2a0" }}
            />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#68e2a0] uppercase">
              Ouvert aux devis
            </span>
          </div>
        </div>

        {/* ── Full-width Headline ── */}
        <div className="mb-16 md:mb-20">
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontSize: "clamp(42px, 7vw, 128px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
            }}
          >
            {/* Line 1: filled */}
            <div data-ct="hl-1" className="block text-[#f6f6f7]">
              PARLONS
            </div>
            {/* Line 2: filled blue */}
            <div
              data-ct="hl-2"
              className="block text-[#3b7bff]"
            >
              ENSEMBLE.
            </div>
          </div>

          <p
            data-ct="tagline"
            className="mt-8 md:mt-10 max-w-[48ch] text-[15px] md:text-[17px] leading-[1.75] text-white/50"
            style={{ fontFamily: "var(--font-d)" }}
          >
            Un projet ambitieux mérite une conversation directe.
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-16 items-start">

          {/* ─── LEFT COLUMN ─── */}
          <div className="flex flex-col gap-14 min-w-0">

            {/* EMAIL */}
            <div data-ct="email">
              <p className="font-mono text-[9px] tracking-[0.25em] text-white/28 uppercase mb-4">
                Écrire directement
              </p>
              <Magnetic strength={0.12} radius={90}>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  onMouseEnter={handleEmailMouseEnter}
                  className="group relative inline-flex items-center gap-4 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:opacity-90"
                  aria-label="Copier l'adresse email"
                  data-cursor="view"
                  data-cursor-text={copied ? "COPIÉ !" : "COPIER"}
                >
                  {/* Underline draw */}
                  <span className="relative">
                    <span
                      ref={emailRef}
                      className="font-mono text-[clamp(13px,1.8vw,20px)] tracking-wide text-[#f6f6f7] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#3b7bff] group-focus-visible:text-[#3b7bff]"
                    >
                      {CONTACT_EMAIL}
                    </span>
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-0 bg-[#3b7bff] group-hover:w-full group-focus-visible:w-full"
                      style={{ transition: "width var(--duration-ui-slow) var(--ease)" }}
                    />
                  </span>
                  <span
                    className="font-mono text-[9px] tracking-[0.2em] uppercase transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ color: copied ? "#68e2a0" : "rgba(246,246,247,0.28)" }}
                  >
                    {copied ? "✓ Copié" : "→"}
                  </span>
                </button>
              </Magnetic>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex flex-col gap-4">
              <p className="font-mono text-[9px] tracking-[0.25em] text-white/28 uppercase mb-1">
                Réseaux
              </p>
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  data-ct="social"
                  className="group inline-flex items-center gap-5 w-fit"
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/22 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#3b7bff] group-focus-visible:text-[#3b7bff]">
                    0{i + 1}
                  </span>
                  <span className="relative font-mono text-[11px] tracking-[0.14em] uppercase text-white/55 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white group-focus-visible:text-white">
                    {social.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#3b7bff] group-hover:w-full group-focus-visible:w-full"
                      style={{ transition: "width var(--duration-ui-slow) var(--ease)" }}
                    />
                  </span>
                  <span
                    className="text-white/18 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#3b7bff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:text-[#3b7bff] group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
                    aria-hidden
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ─── Vertical separator (desktop) ─── */}
          <div
            aria-hidden
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)" }}
          />

          {/* ─── RIGHT COLUMN — Form ─── */}
          <div className="lg:pl-12">
            {formState === "sent" ? (
              // ── Success state ──────────────────────────────────────────────
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full border border-[#68e2a0]/50">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 11.5L9 16.5L18 6" stroke="#68e2a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3
                  className="font-extrabold leading-tight tracking-tighter"
                  style={{ fontFamily: "var(--font-d)", fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  Message reçu.
                </h3>
                <p className="text-white/45 text-[15px] leading-relaxed max-w-[34ch]">
                  On revient vers vous sous 24h. En attendant, suivez notre actualité.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/30 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white/70 focus-visible:text-white/70 w-fit mt-2 rounded-sm focus-visible:outline-offset-4"
                >
                  ← Envoyer un autre message
                </button>
              </div>
            ) : (
              // ── Form ──────────────────────────────────────────────────────
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-9">

                {/* Nom */}
                <FormField
                  id="ct-name"
                  label="Votre nom"
                  value={fields.name}
                  onChange={(v) => setFields((f) => ({ ...f, name: v }))}
                  placeholder="Jean Dupont"
                />

                {/* Type de projet */}
                <FormField
                  id="ct-type"
                  label="Type de projet"
                  value={fields.type}
                  onChange={(v) => setFields((f) => ({ ...f, type: v }))}
                  placeholder="Site vitrine, SaaS, WebGL…"
                />

                {/* Message */}
                <FormField
                  id="ct-message"
                  label="Message"
                  value={fields.message}
                  onChange={(v) => setFields((f) => ({ ...f, message: v }))}
                  placeholder="Parlez-nous de votre projet…"
                  multiline
                />

                {/* Submit row */}
                <div data-ct="submit" className="flex items-center justify-between pt-2">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/22 uppercase">
                    Réponse &lt; 24h
                  </span>
                  <Magnetic strength={0.4} radius={90}>
                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      aria-label="Envoyer le message"
                      data-cursor="view"
                      data-cursor-text="SEND"
                      className="group relative flex items-center justify-center w-[96px] h-[96px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_55%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] active:scale-[0.97]"
                      style={{
                        border: "1px solid rgba(255,255,255,0.15)",
                        transition:
                          "border-color var(--duration-ui) var(--ease), background var(--duration-ui) var(--ease), transform var(--duration-ui) var(--ease)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59,123,255,0.5)";
                        e.currentTarget.style.background = "rgba(59,123,255,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* Dashed rotating ring */}
                      <svg
                        aria-hidden
                        className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100"
                        viewBox="0 0 96 96"
                        fill="none"
                        style={{ animation: "spin 12s linear infinite" }}
                      >
                        <circle
                          cx="48" cy="48" r="46"
                          stroke="#3b7bff"
                          strokeWidth="0.6"
                          strokeDasharray="3 7"
                        />
                      </svg>

                      {formState === "sending" ? (
                        <svg className="w-5 h-5 text-[#3b7bff]" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.9s linear infinite" }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <span className="flex flex-col items-center gap-1.5 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-focus-visible:scale-105">
                          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/60 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-white group-focus-visible:text-white">
                            ENVOYER
                          </span>
                          <span
                            className="text-white/40 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#3b7bff] group-hover:translate-x-0.5 group-focus-visible:text-[#3b7bff] group-focus-visible:translate-x-0.5"
                            aria-hidden
                          >
                            →
                          </span>
                        </span>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Footer rule + credits ── */}
        <div className="mt-28 md:mt-36">
          <div
            data-ct="rule"
            className="h-px w-full mb-8 origin-left"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-mono text-[9px] tracking-[0.22em] text-white/22 uppercase" suppressHydrationWarning>
              © {new Date().getFullYear()} Eidos Studio · Lannion, Bretagne
            </span>
            <span className="font-mono text-[9px] tracking-[0.22em] text-white/22 uppercase">
              Conçu et développé avec soin · Next.js · TypeScript
            </span>
          </div>
        </div>
      </div>

      {/* ── Keyframes (spin for SVG ring) ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

// ─── FormField sub-component ──────────────────────────────────────────────────
function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const sharedClass =
    "w-full bg-transparent py-3 text-[16px] leading-relaxed text-[#f6f6f7] placeholder:text-white/15 outline-none peer resize-none rounded-sm transition-[color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--accent)_48%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

  return (
    <div data-ct="field" className="flex flex-col gap-2 group/field">
      <label
        htmlFor={id}
        className="font-mono text-[9px] tracking-[0.25em] uppercase transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ color: "rgba(246,246,247,0.28)" }}
      >
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            rows={4}
            required={id === "ct-message"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={sharedClass}
            style={{ fontFamily: "var(--font-d)" }}
          />
        ) : (
          <input
            id={id}
            type="text"
            required={id === "ct-name"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={sharedClass}
            style={{ fontFamily: "var(--font-d)" }}
          />
        )}
        {/* Static track */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        {/* Animated accent line */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-0 peer-focus:w-full"
          style={{
            background: "linear-gradient(90deg, #3b7bff, #8eb1ff)",
            transition: "width var(--duration-ui-slow) var(--ease)",
          }}
        />
      </div>
    </div>
  );
}
