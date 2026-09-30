## 1. Site URL

- [x] 1.1 Add `src/lib/site.ts` (`SITE_URL`, `siteUrl(path)`) with a localhost fallback
- [x] 1.2 Compute `NEXT_PUBLIC_SITE_URL` in the deploy workflow (`vars.SITE_URL` or `https://<owner>.github.io` + base path) and pass `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` from `vars`. Keep action pins and permissions unchanged

## 2. Metadata

- [x] 2.1 In `[lang]/layout.tsx`, add `metadataBase`, canonical, `hreflang` alternates (en, de, x-default), `og:url`, `og:site_name`, `alternateLocale`, `summary_large_image`, optional Google verification, and localized keywords from the dictionaries
- [x] 2.2 Give the root `/` layout the same alternates and a self-canonical. Verify in the built HTML of `/`, `/en/` and `/de/` that all URLs are absolute with the base path exactly once

## 3. Preview image

- [x] 3.1 Read the bundled `opengraph-image` docs for static export, then add `[lang]/opengraph-image.tsx` (1200×630, space look, name + localized tagline, no fetched assets) and `twitter-image.tsx`
- [x] 3.2 Verify that `out/` contains both PNGs, that the meta tags point at them with absolute URLs, and check the images visually

## 4. Sitemap and robots

- [x] 4.1 Add `app/sitemap.ts` (both languages, alternates, lastModified) and `app/robots.ts` (allow all, sitemap URL). Verify that `out/sitemap.xml` and `out/robots.txt` exist, that their content is correct, and that the 404 page is not listed

## 5. Structured data

- [x] 5.1 Add JSON-LD (`WebSite`, `ProfilePage`, `Person`) to the language page from the portfolio data and dictionaries, escaped, without the email
- [x] 5.2 Validate the JSON-LD from the built HTML (parse it, check required fields, check that `@id` references resolve)

## 6. Clean main heading

- [x] 6.1 Render the `NameSwap` placeholders and swap letters and the hero intro via `data-text` + generated content, so the `<h1>` text is only the sr-only label
- [x] 6.2 Verify that `h1.textContent === "Jan Brunner"` in the built HTML, and that screenshots of the hero (intro and mid-swap, desktop and mobile) are unchanged

## 7. Crawlers

- [x] 7.1 Treat crawler user agents as "static background" in `sceneSupport.ts`. Verify with a Googlebot user agent that the stacked layout loads without three.js, and that a normal Chrome user agent still gets the journey

## 8. Checks

- [x] 8.1 Run `tsc --noEmit`, `npm run lint`, `npm run build`, and the behaviour checks (navbar, Tab, hash, idle 0 draws)
- [x] 8.2 Build with `NEXT_PUBLIC_SITE_URL=https://jbrunnerhtl.github.io/personal-wesite3.0` and `NEXT_PUBLIC_BASE_PATH=/personal-wesite3.0`, then check the head tags, sitemap, robots and JSON-LD of that build
