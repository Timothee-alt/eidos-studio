import type { MetadataRoute } from "next";
import { getProjectCaseSlugs } from "@/lib/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.eidos-studio.com";
  const lastModified = new Date();

  const projectUrls: MetadataRoute.Sitemap = getProjectCaseSlugs().map((slug) => ({
    url: `${base}/projets/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${base}/services/vitrine`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${base}/services/saas`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${base}/services/ecommerce`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
