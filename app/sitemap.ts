import type { MetadataRoute } from "next";
import { getPrograms, SITE_URL } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programs = await getPrograms();
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/orgs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/start`, changeFrequency: "monthly", priority: 0.8 },
    ...programs.map((p) => ({
      url: `${SITE_URL}/programs/${p.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
