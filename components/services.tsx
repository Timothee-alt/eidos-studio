"use client";

import Link from "next/link";
import { HOME_CHAPTERS, SERVICES } from "@/lib/data";

export function Services() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden border-t border-border px-6 py-28 md:px-8 md:py-32"
      aria-label="Competences"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 18% 18%, rgba(59,123,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12">
          <div>
            <p className="label mb-6">[ EXPERTISES ]</p>
            <h2
              className="mb-5 max-w-3xl font-extrabold leading-[0.97] tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-d)", fontSize: "clamp(42px, 6.2vw, 92px)" }}
            >
              Des expertises
              <br />
              pensées pour convertir.
            </h2>
            <p
              className="max-w-2xl text-base leading-[1.75] text-(--muted)"
              style={{ fontFamily: "var(--font-b)" }}
            >
              Design premium, hiérarchie claire, interactions rapides.
              Chaque bloc pousse vers l'action utile.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {HOME_CHAPTERS.map((chapter) => (
              <article key={chapter.id} className="card p-4">
                <p className="label mb-2">{chapter.eyebrow}</p>
                <h3
                  className="mb-2 text-base font-semibold leading-tight text-white"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {chapter.title}
                </h3>
                <p className="text-sm text-(--muted)">{chapter.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {SERVICES.map((service, index) => {
            const body = (
              <article className="card group flex h-full flex-col p-6 md:p-8">
                <p className="label mb-6">{String(index + 1).padStart(2, "0")} · {service.id}</p>
                <h3
                  className="mb-4 text-[clamp(24px,3vw,38px)] font-bold leading-[1.02] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {service.title}
                </h3>
                <p className="mb-8 text-sm leading-[1.7] text-(--muted)">{service.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );

            if (!service.href) return <div key={service.id}>{body}</div>;
            return (
              <Link key={service.id} href={service.href} className="block">
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
