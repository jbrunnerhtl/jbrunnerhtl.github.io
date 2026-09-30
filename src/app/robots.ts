import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Crawlers only read robots.txt at the host root, so on a GitHub Pages project site this file has
// no effect (submit the sitemap in Search Console instead); it applies on a custom domain.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl("sitemap.xml"),
  };
}
