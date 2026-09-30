## Context

- The site is a static export (`output: "export"`, `trailingSlash: true`) published to GitHub Pages as a project site: `https://jbrunnerhtl.github.io/personal-wesite3.0/`. `NEXT_PUBLIC_BASE_PATH` is computed in the deploy workflow. There is no site URL anywhere yet.
- There are two root layouts. `app/[lang]/layout.tsx` (with `generateMetadata` per language: title, description, keywords, author, Open Graph with title, description, type and locale) and `app/(root)/layout.tsx` (the `/` language chooser, which redirects by script and has plain links without JS). `global-not-found.tsx` is the `noindex` 404.
- The built `/de/` head has no canonical, no alternates, no `og:url`/`og:image`, a `summary` Twitter card, and no JSON-LD. There is no `sitemap.xml` or `robots.txt`.
- The hero `<h1>` renders a `sr-only` label, an `aria-hidden` grid with one invisible size placeholder per name (full letter markup), and either the intro (`RevealText` words) or the two swap layers. All of that is DOM text, so `h1.textContent` is "Jan BrunnerJan Brunner.JBrunnerhtlJanJan Brunner.Brunner.".
- `canShowScene()` (in `sceneSupport.ts`) decides journey mode on the client. Crawlers that render with WebGL get the journey, where content is transparent and parked off-screen outside the held station.
- On a GitHub Pages project site, crawlers only read `robots.txt` at the host root (`jbrunnerhtl.github.io/robots.txt`). A `robots.txt` under `/personal-wesite3.0/` is ignored. The sitemap therefore has to be submitted in a search console, and that needs site verification.

## Goals / Non-Goals

**Goals:**
- Absolute canonical, alternate and Open Graph URLs.
- A preview image per language.
- A sitemap, plus `robots.txt` (effective as soon as the site is on a user site or custom domain).
- Valid `Person`/`ProfilePage` JSON-LD.
- A clean `<h1>`.
- The stacked layout for crawlers.
- Optional verification.
- All without visible changes for visitors.

**Non-Goals:**
- No move to a custom domain or user site.
- No copy rewrite (titles and descriptions stay as they are, only keywords get localized).
- No per-project subpages.
- No analytics.
- No performance work beyond what exists.

## Decisions

### 1. Site URL
- A new `src/lib/site.ts` exports `SITE_URL`: `NEXT_PUBLIC_SITE_URL` without a trailing slash, falling back to `http://localhost:3000` + `BASE_PATH`. It also exports `siteUrl(path)` for absolute URLs with a trailing slash.
- In the deploy workflow's base-path step, the site URL is computed: `vars.SITE_URL` if set, else `https://<owner in lowercase>.github.io` + base path. It is passed as `NEXT_PUBLIC_SITE_URL` to the build.
- *Alternative:* `actions/configure-pages` (it outputs `base_url`). This was rejected because it adds another action that would need to be pinned, and the needed value is already derivable.
- Metadata uses absolute URLs from `siteUrl()` everywhere, rather than relying on how `metadataBase` combines with `basePath`. `metadataBase` is still set to `SITE_URL + "/"`, so generated image URLs are absolute. Whether the base path appears exactly once in the `og:image` URL gets verified in the built HTML.

### 2. Canonical and alternates
- `[lang]/layout.tsx` `generateMetadata` adds `alternates: { canonical: siteUrl(lang), languages: { en: siteUrl("en"), de: siteUrl("de"), "x-default": siteUrl("") } }`, plus `openGraph.url`, `siteName` and `alternateLocale`.
- `(root)/layout.tsx` gets the same `languages` and a canonical to itself.

### 3. Preview image
- A route handler `app/[lang]/og.png/route.tsx` (`GET`, `dynamic = "force-static"`, `generateStaticParams` over `LOCALES`) returns an `ImageResponse` from `next/og`, 1200×630. The static export writes it as `/<lang>/og.png`.
- The `opengraph-image` file convention was tried first. It exports extensionless files (`/de/opengraph-image`), which GitHub Pages serves as `application/octet-stream`, and link-preview crawlers may reject that.
- The image shows a dark radial space gradient, deterministic star dots (seeded, kept out of the text block), the hero line, the name with the chrome gradient on "Brunner.", the hero tagline in the page's language, and `github.com/jbrunnerhtl`. It uses the `ImageResponse` default font, so nothing is fetched at build time.
- The metadata references it explicitly for Open Graph and the `summary_large_image` Twitter card: absolute URL, size, type, and alt text of name + hero line.

### 4. Sitemap and robots
- `app/sitemap.ts` returns `/en/` and `/de/`, each with `alternates.languages` and `lastModified` = build time.
- `app/robots.ts` allows `/` and names `siteUrl("sitemap.xml")`. Both use `dynamic = "force-static"`.
- Both files live under `app/` next to the two route groups. It will be verified that `out/sitemap.xml` and `out/robots.txt` are emitted.

### 5. Structured data
- A server component `StructuredData` in `[lang]/page.tsx` renders `<script type="application/ld+json">` with a `@graph`:
  - `WebSite` (`@id` `SITE_URL/#website`, name, url, `inLanguage` en/de)
  - `ProfilePage` (`@id` page URL, url, name = meta title, `inLanguage`, `isPartOf` website, `mainEntity` → person)
  - `Person` (`@id` `SITE_URL/#person`, name, `alternateName` handle, url, `sameAs` [GitHub], `affiliation`/`alumniOf` `EducationalOrganization` "HTL Leonding", `address` region "Oberösterreich"/"Upper Austria" and country "AT", `knowsAbout` = the skill items, `jobTitle`-like `description` from the dictionary)
- The JSON is escaped (`<` → `<`).
- The email is left out, so it isn't harvested from structured data. It stays in the visible contact section.

### 6. Clean `<h1>`
- The sr-only label stays the only text node. Every visual glyph in `NameSwap` (the size placeholders, the swap letters, the spaces between words) and the hero intro (`RevealText` words and the space between them) renders its characters through a `.glyph` class (`::before { content: attr(data-text) }`) instead of text nodes. `RevealText`, which is only used inside NameSwap's `aria-hidden` intro, drops its own sr-only copy. Layout, masks, gradients (`background-clip: text` covers generated content) and animations stay the same.
- This is verified by comparing screenshots of the hero before and after, frozen at the intro and mid-swap.
- *Trade-off:* the visual name can no longer be selected with the mouse. This is accepted, because the name is also in the title, navbar and footer, and it is only the display heading.
- *Alternative:* removing the label and letting the intro be the text. This was rejected because the intro leaves the DOM during swaps, which would leave the heading empty for screen readers.

### 7. Crawlers get the stacked layout
- `prefersStaticBackground()` also returns true when `navigator.userAgent` matches known crawlers and link-preview bots (`Googlebot`, `bingbot`, `DuckDuckBot`, `YandexBot`, `Baiduspider`, `Applebot`, `facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `Slackbot`, `Discordbot`, `WhatsApp`, and the generic `bot|crawler|spider`).
- The content is identical, so this is not cloaking. Lighthouse and PageSpeed are deliberately not matched, so their measurements reflect what visitors get.

### 8. Verification and keywords
- `verification.google` comes from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, which the workflow fills from `vars.GOOGLE_SITE_VERIFICATION`. When it is unset, no tag is emitted.
- `meta.keywords` moves into both dictionaries (the German one uses German terms such as "Softwareentwicklung", "Oberösterreich").

## Risks / Trade-offs

- [`robots.txt` has no effect on the project-site subpath] → It is documented and still emitted. The sitemap gets submitted through Search Console after verification (URL-prefix property). It takes effect automatically on a custom domain.
- [Generated preview images need an image content type on static hosts] → They are emitted as `.png` files by a route handler (see decision 3).
- [Generated-content glyphs could render slightly differently from text nodes (kerning across letters)] → The letters are already separate inline-blocks, so there is no cross-letter kerning today either. This is verified by screenshot comparison.
- [User-agent sniffing can misclassify an unusual real browser as a bot] → The patterns are specific. The worst case is the stacked page, which is a full, supported layout.
