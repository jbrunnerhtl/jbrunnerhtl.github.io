import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

// The language home pages and every project page, each listing its other language as alternate.
// The 404 page is noindex and left out.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries([...LOCALES.map((l) => [l, siteUrl(l)]), ["x-default", siteUrl()]]);
  const lastModified = new Date();
  const home: MetadataRoute.Sitemap = LOCALES.map((lang) => ({
    url: siteUrl(lang),
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages },
  }));
  const projects: MetadataRoute.Sitemap = PORTFOLIO_DATA.projects.flatMap((p) => {
    const path = (l: string) => siteUrl(`${l}/projects/${p.id}`);
    const projectLanguages = Object.fromEntries(LOCALES.map((l) => [l, path(l)]));
    return LOCALES.map((lang) => ({
      url: path(lang),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: projectLanguages },
    }));
  });
  return [...home, ...projects];
}
