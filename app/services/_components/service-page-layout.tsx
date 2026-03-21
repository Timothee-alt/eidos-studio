import type { Metadata } from "next";
import Link from "next/link";
import type { ServicePage } from "@/lib/data";

type ServicePageLayoutProps = {
  page: ServicePage;
  serviceCode: string;
  ogTitle: string;
  canonicalPath: `/services/${string}`;
};

export function buildServiceMetadata({
  page,
  ogTitle,
  canonicalPath,
}: Omit<ServicePageLayoutProps, "serviceCode">): Metadata {
  const canonical = `https://www.eidos-studio.com${canonicalPath}`;
  return {
    title: page.metaTitle,
    description: page.description,
    keywords: [
      "agence web lannion",
      "agence web bretagne",
      "next.js",
      "site premium",
      page.title.toLowerCase(),
    ],
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: page.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: page.description,
    },
  };
}

export function ServicePageLayout({
  page,
  serviceCode,
}: Pick<ServicePageLayoutProps, "page" | "serviceCode">) {
  return (
    <main id="main">
      <section className="page-inline relative overflow-hidden border-t border-border py-28 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 70% 0%, rgba(59, 123, 255, 0.1) 0%, transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/#capabilities"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-(--muted) transition-colors hover:text-text"
            aria-label="Retour aux expertises sur la page d'accueil"
          >
            ← Tous les services
          </Link>
          <p className="label mb-4">[ {serviceCode} ]</p>
          <h1
            className="mb-6 max-w-3xl font-extrabold leading-tight tracking-[-0.04em] text-text"
            style={{ fontFamily: "var(--font-d)", fontSize: "clamp(38px, 5.5vw, 64px)" }}
          >
            {page.title}
          </h1>
          <p
            className="mb-12 max-w-3xl text-lg leading-relaxed text-(--muted)"
            style={{ fontFamily: "var(--font-b)" }}
          >
            {page.description}
          </p>

          <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2">
            {page.highlights.map((highlight) => (
              <div key={highlight} className="card p-5">
                <p className="label mb-2">[ POINT CLÉ ]</p>
                <p className="text-sm leading-[1.7] text-(--muted)" style={{ fontFamily: "var(--font-b)" }}>
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              className="btn-primary-filled inline-flex"
              aria-label={`${page.cta} — section Contact sur l'accueil`}
            >
              {page.cta}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/#projets"
              className="btn-hero-ghost inline-flex"
              aria-label="Voir les projets sur la page d'accueil"
            >
              Voir les projets
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
