import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);
  if (!project) return { title: "Projet non trouvé" };

  return {
    title: `${project.title} — Étude de cas · Eidos Studio`,
    description: `${project.description} Réalisé par Eidos Studio avec ${project.tags.slice(0, 3).join(", ")}.`,
    alternates: {
      canonical: `https://www.eidos-studio.com/projets/${slug}`,
    },
    openGraph: {
      title: `${project.title} · Eidos Studio`,
      description: project.tagline,
      url: `https://www.eidos-studio.com/projets/${slug}`,
      images: project.ogImage ? [{ url: project.ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getCaseStudyBySlug(slug);

  if (!project) notFound();

  const primaryMetric = project.results.metrics[0];
  const secondaryMetric = project.results.metrics[1];
  const tertiaryMetric = project.results.metrics[2];

  return (
    <main id="main">
      <article className="border-t border-border">
        {/* Hero case study */}
        <header className="relative overflow-hidden border-b border-border px-6 py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 65% 10%, rgba(59,123,255,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(167,139,250,0.06) 0%, transparent 50%), linear-gradient(160deg, #0a0a12 0%, #050507 100%)",
            }}
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_280px] lg:gap-10">
            <div>
              <Link
                href="/#projets"
                className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted) transition-colors hover:text-text"
              >
                ← Retour aux projets
              </Link>
              <p
                className="label mb-4"
                style={{ fontFamily: "var(--font-m)" }}
              >
                {project.id} · {project.client}
              </p>
              <h1
                className="mb-4 font-extrabold leading-tight tracking-[-0.04em] text-text"
                style={{
                  fontFamily: "var(--font-d)",
                  fontSize: "clamp(38px, 5.5vw, 68px)",
                }}
              >
                {project.title}
              </h1>
              <p
                className="mb-8 max-w-3xl text-lg leading-relaxed text-(--muted)"
                style={{ fontFamily: "var(--font-b)" }}
              >
                {project.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside
              className="h-fit border border-border p-5"
              style={{ background: "rgba(10, 10, 16, 0.7)" }}
            >
              <p className="label mb-4">[ IMPACT ]</p>
              {primaryMetric && (
                <div className="mb-5">
                  <p
                    className="mb-1 text-[10px] uppercase tracking-[0.16em] text-(--muted)"
                    style={{ fontFamily: "var(--font-m)" }}
                  >
                    {primaryMetric.label}
                  </p>
                  <p
                    className="text-3xl font-extrabold text-accent"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {primaryMetric.value}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {secondaryMetric && (
                  <div className="border-t border-border pt-3">
                    <p
                      className="mb-1 text-[10px] uppercase tracking-[0.16em] text-(--muted)"
                      style={{ fontFamily: "var(--font-m)" }}
                    >
                      {secondaryMetric.label}
                    </p>
                    <p className="text-sm text-text" style={{ fontFamily: "var(--font-b)" }}>
                      {secondaryMetric.value}
                    </p>
                  </div>
                )}
                {tertiaryMetric && (
                  <div className="border-t border-border pt-3">
                    <p
                      className="mb-1 text-[10px] uppercase tracking-[0.16em] text-(--muted)"
                      style={{ fontFamily: "var(--font-m)" }}
                    >
                      {tertiaryMetric.label}
                    </p>
                    <p className="text-sm text-text" style={{ fontFamily: "var(--font-b)" }}>
                      {tertiaryMetric.value}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </header>

        {/* Contenu */}
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="label mb-3">[ CLIENT ]</p>
              <p style={{ fontFamily: "var(--font-b)" }} className="text-sm text-text">
                {project.client}
              </p>
            </div>
            <div className="card p-6">
              <p className="label mb-3">[ STACK ]</p>
              <p style={{ fontFamily: "var(--font-b)" }} className="text-sm text-text">
                {project.approach.stack.slice(0, 3).join(" · ")}
              </p>
            </div>
            <div className="card p-6">
              <p className="label mb-3">[ OBJECTIF ]</p>
              <p style={{ fontFamily: "var(--font-b)" }} className="text-sm text-text">
                {project.context.objectives[0]}
              </p>
            </div>
          </div>

          <p
            className="mb-20 max-w-4xl text-[18px] leading-[1.82] text-(--muted)"
            style={{ fontFamily: "var(--font-b)" }}
          >
            {project.description}
          </p>

          {/* Contexte */}
          <section className="mb-20">
            <h2
              className="label mb-6"
              style={{ fontFamily: "var(--font-m)" }}
            >
              [ CONTEXTE ]
            </h2>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <h3 className="mb-2 font-semibold text-text" style={{ fontFamily: "var(--font-d)" }}>
                  Mission
                </h3>
                <p className="max-w-3xl text-(--muted)" style={{ fontFamily: "var(--font-b)" }}>
                  {project.context.mission}
                </p>
              </div>
              <div className="card p-6">
                <h3 className="mb-2 font-semibold text-text" style={{ fontFamily: "var(--font-d)" }}>
                  Objectifs
                </h3>
                <ul className="list-inside list-disc space-y-2 text-(--muted)" style={{ fontFamily: "var(--font-b)" }}>
                  {project.context.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Approche */}
          <section className="mb-20">
            <h2
              className="label mb-6"
              style={{ fontFamily: "var(--font-m)" }}
            >
              [ APPROCHE ]
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="mb-2 font-semibold text-text" style={{ fontFamily: "var(--font-d)" }}>
                  Stack technique
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.approach.stack.map((tech) => (
                    <span key={tech} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <p className="max-w-4xl text-(--muted)" style={{ fontFamily: "var(--font-b)" }}>
                {project.approach.process}
              </p>
              <div>
                <h3 className="mb-2 font-semibold text-text" style={{ fontFamily: "var(--font-d)" }}>
                  Décisions clés
                </h3>
                <div className="space-y-3">
                  {project.approach.decisions.map((d, i) => (
                    <div key={i} className="card flex items-start gap-4 p-4">
                      <span
                        className="mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.16em] text-accent"
                        style={{ fontFamily: "var(--font-m)" }}
                      >
                        0{i + 1}
                      </span>
                      <p className="text-(--muted)" style={{ fontFamily: "var(--font-b)" }}>
                        {d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Résultats */}
          <section className="mb-16">
            <h2
              className="label mb-6"
              style={{ fontFamily: "var(--font-m)" }}
            >
              [ RÉSULTATS ]
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {project.results.metrics.map((m) => (
                <div key={m.label} className="card p-6">
                  <p className="label mb-2" style={{ fontFamily: "var(--font-m)" }}>
                    {m.label}
                  </p>
                  <p
                    className="text-2xl font-bold text-accent"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            {project.results.kpis && project.results.kpis.length > 0 && (
              <div className="mt-8 card p-6">
                <p className="label mb-3">[ KPI SUIVIS ]</p>
                <div className="flex flex-wrap gap-2">
                  {project.results.kpis.map((kpi) => (
                    <span key={kpi} className="tag">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.results.testimonial && (
              <blockquote
                className="mt-8 border-l-2 border-accent bg-accent/5 p-6 italic text-(--muted)"
                style={{ fontFamily: "var(--font-b)" }}
              >
                « {project.results.testimonial} »
              </blockquote>
            )}
          </section>

          {/* CTA */}
          <div className="border-t border-border pt-16">
            <p className="mb-3 label">[ PROCHAINE ÉTAPE ]</p>
            <p className="mb-6 font-semibold text-text" style={{ fontFamily: "var(--font-d)" }}>
              Un projet similaire en tête ?
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/#contact" className="btn-primary-filled inline-flex">
                Demander un devis
                <span aria-hidden>→</span>
              </Link>
              <Link href="/#projets" className="btn-hero-ghost inline-flex">
                Voir d&apos;autres projets
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
