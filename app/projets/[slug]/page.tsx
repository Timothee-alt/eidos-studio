import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { ProjectCaseExperience } from "@/components/project-case/project-case-experience";
import { ProjectCaseJsonLd } from "@/components/project-case/project-case-json-ld";
import {
  getNextProjectSlug,
  getPrevProjectSlug,
  getProjectCaseSlugs,
  getProjectCaseStudy,
} from "@/lib/data/projects";

const SITE = "https://www.eidos-studio.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectCaseSlugs().map((slug) => ({ slug }));
}

function ogImageForStudy(study: NonNullable<ReturnType<typeof getProjectCaseStudy>>) {
  if (study.image && study.image.length > 0) {
    return study.image.startsWith("http")
      ? study.image
      : `${SITE}${study.image.startsWith("/") ? "" : "/"}${study.image}`;
  }
  return `${SITE}/og-image.png`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getProjectCaseStudy(slug);
  if (!s) return { title: "Projet" };

  const url = `${SITE}/projets/${slug}`;
  const title = `${s.title} — étude de cas`;
  const description = s.leadIn;
  const ogImage = ogImageForStudy(s);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${s.title} · Eidos Studio`,
      description,
      type: "article",
      url,
      locale: "fr_FR",
      siteName: "Eidos Studio",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${s.title} — étude de cas Eidos Studio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${s.title} · Eidos Studio`,
      description,
      images: [ogImage],
      creator: "@eidos_studio",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function ProjectCasePage({ params }: Props) {
  const { slug } = await params;
  const study = getProjectCaseStudy(slug);
  if (!study || !study.slug) notFound();

  const nextSlug = getNextProjectSlug(slug);
  const prevSlug = getPrevProjectSlug(slug);
  const nextFull = nextSlug ? getProjectCaseStudy(nextSlug) : null;
  const prevFull = prevSlug ? getProjectCaseStudy(prevSlug) : null;

  const teaserPick = (p: NonNullable<typeof nextFull>) => ({
    slug: p.slug!,
    title: p.title,
    titleLines: p.titleLines,
    hex: p.hex,
    gradientBg: p.gradientBg,
    client: p.client,
  });

  const nextTeaser = nextFull ? teaserPick(nextFull) : null;
  const prevTeaser = prevFull ? teaserPick(prevFull) : null;

  return (
    <main id="main">
      <ProjectCaseJsonLd study={study} />
      <ProjectCaseExperience study={study} prevTeaser={prevTeaser} nextTeaser={nextTeaser} />
      <Footer />
    </main>
  );
}
