import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.eidos-studio.com";
  const lastModified = new Date();

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
    ...CASE_STUDIES.map((cs) => ({
      url: `${base}/projets/${cs.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
