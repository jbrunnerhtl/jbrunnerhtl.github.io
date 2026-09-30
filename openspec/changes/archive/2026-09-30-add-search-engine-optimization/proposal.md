## Why

The portfolio should be found when someone searches for Jan Brunner, and it should look good when shared. The built pages have a title, description and basic Open Graph tags, but search engines and link previews are missing most of what they rely on:

- There is no site URL (`metadataBase`), and therefore no canonical URL, no `og:url` and no `hreflang` links between `/en/` and `/de/`. Search engines can't tell the two languages apart as translations of the same page.
- There is no preview image, so shared links show an empty card.
- There is no `sitemap.xml`, no `robots.txt` and no structured data (JSON-LD) that says who the page is about.
- The main heading's HTML text reads "Jan BrunnerJan Brunner.JBrunnerhtlJanJan Brunner.Brunner.". This is because the name swap's invisible size placeholders and screen reader label all sit inside the `<h1>` as text.
- Crawlers that render JavaScript with WebGL (for example Googlebot) may get journey mode, where every station except one is transparent and parked off-screen.

## What Changes

- Configure the site URL at build time (GitHub Pages URL from the deploy workflow, overridable for a custom domain). Every page gets absolute canonical and Open Graph URLs.
- `/en/` and `/de/` link to each other with `hreflang`, and the root `/` language chooser is the `x-default`.
- A generated Open Graph / Twitter preview image per language (1200×630, in the site's space look, made in code).
- A `sitemap.xml` listing both languages with their alternates, and a `robots.txt` pointing to it.
- JSON-LD structured data: a `ProfilePage` whose main entity is a `Person` (name, handle, GitHub, school, location, skills), plus the `WebSite`.
- The hero `<h1>` contains the name once as text. The name swap's placeholders and animation stay visual-only.
- Crawlers get the stacked layout (same content, no journey), detected by user agent.
- Optional Google Search Console verification via a build-time variable.
- Localized keywords per language.

## Capabilities

### New Capabilities
- `search-engine-optimization`: what search engines and link previews get: site URL and canonical URLs, language alternates, preview image, sitemap and robots, structured data, a clean main heading, and optional search console verification.

### Modified Capabilities
- `station-journey`: "Journey Mode and Stacked Fallback" also keeps the stacked layout for crawlers.
- `site-deployment`: "Automated Static Deployment" passes the site URL to the build.

## Impact

- `next.config.ts` / `src/lib/basePath.ts` (or a new `src/lib/site.ts`): site URL.
- `src/app/[lang]/layout.tsx`, `src/app/(root)/layout.tsx`: metadata (`metadataBase`, alternates, Open Graph, verification), JSON-LD.
- New `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[lang]/opengraph-image.tsx`.
- `src/components/ui/NameSwap.tsx`: heading text.
- `src/lib/sceneSupport.ts`: crawler check.
- `src/i18n/dictionaries/*`: keywords.
- `.github/workflows/deploy.yml`: `NEXT_PUBLIC_SITE_URL`.
- No new dependencies (`next/og` ships with Next). The visible page is unchanged for visitors.
