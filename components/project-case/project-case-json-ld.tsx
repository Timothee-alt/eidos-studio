import type { ProjectCaseStudy } from "@/lib/data/projects";

const SITE = "https://www.eidos-studio.com";

type Props = { study: ProjectCaseStudy };

export function ProjectCaseJsonLd({ study }: Props) {
  if (!study.slug) return null;

  const url = `${SITE}/projets/${study.slug}`;
  const image =
    study.image && study.image.length > 0
      ? study.image.startsWith("http")
        ? study.image
        : `${SITE}${study.image.startsWith("/") ? "" : "/"}${study.image}`
      : `${SITE}/og-image.png`;

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#creativework`,
    name: study.title,
    headline: study.title,
    description: study.leadIn,
    url,
    image: { "@type": "ImageObject", url: image },
    dateCreated: `${study.year}-01-01`,
    inLanguage: "fr-FR",
    keywords: study.tags.join(", "),
    author: {
      "@type": "Organization",
      name: "Eidos Studio",
      url: SITE,
    },
    provider: {
      "@type": "Organization",
      name: "Eidos Studio",
      url: SITE,
    },
    about: study.client,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projets",
        item: `${SITE}/#projets`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: study.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
