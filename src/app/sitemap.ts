import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

// Both language pages, each listing the other as its alternate. The 404 page is noindex and left out.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries([...LOCALES.map((l) => [l, siteUrl(l)]), ["x-default", siteUrl()]]);
  const lastModified = new Date();
  return LOCALES.map((lang) => ({
    url: siteUrl(lang),
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages },
  }));
}
