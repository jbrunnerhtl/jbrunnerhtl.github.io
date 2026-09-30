import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Crawlers only read robots.txt at the host root: it takes effect on the jbrunnerhtl.github.io user
// site (and on a custom domain), and leads them to the sitemap. Under a project-site sub-path it is
// ignored, so the sitemap would have to be submitted in Search Console instead.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: siteUrl("sitemap.xml"),
  };
}
