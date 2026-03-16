import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <section
        className="mx-auto max-w-xl text-center"
        aria-labelledby="not-found-title"
      >
        <p className="label mb-4">[ 404 ]</p>
        <h1
          id="not-found-title"
          className="mb-6 font-extrabold leading-tight tracking-[-0.04em] text-text"
          style={{
            fontFamily: "var(--font-d)",
            fontSize: "clamp(48px, 10vw, 96px)",
          }}
        >
          Page introuvable
        </h1>
        <p
          className="mb-12 text-lg leading-relaxed text-(--muted)"
          style={{ fontFamily: "var(--font-b)" }}
        >
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-primary-filled inline-flex">
            Retour à l&apos;accueil
            <span aria-hidden>→</span>
          </Link>
          <Link href="/#contact" className="btn-hero-ghost inline-flex">
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}
