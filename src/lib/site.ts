import type { Metadata } from "next";
import { BASE_PATH } from "./basePath";

// Public URL of the site, base path included and without a trailing slash, e.g.
// "https://jbrunnerhtl.github.io". Set at build time by the deploy workflow;
// local builds fall back to the dev server.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:3000${BASE_PATH}`).replace(/\/+$/, "");

/** Absolute URL of a page (with trailing slash, like the static export) or of a file ("sitemap.xml"). */
export function siteUrl(path = "") {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (!clean) return `${SITE_URL}/`;
  return /\.[a-z0-9]+$/i.test(clean) ? `${SITE_URL}/${clean}` : `${SITE_URL}/${clean}/`;
}

/** Size of the generated link preview image (/<lang>/og.png). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Search console verification tags (Google Search Console, Bing Webmaster Tools), from tokens set at
 * build time. Used on the language pages and on "/", the home page the consoles check.
 */
export function siteVerification(): Metadata["verification"] {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}
