// Sub-path the site is served from: empty on the jbrunnerhtl.github.io user site, custom domains
// and local builds; "/<repo>" on GitHub Pages project sites. Set at build time by the deploy workflow.
// next/link and metadata handle this automatically; plain <a> hrefs and history calls must use it.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Home URL of a locale, with trailing slash to match the static export's folder layout. */
export const localePath = (locale: string) => `${BASE_PATH}/${locale}/`;
