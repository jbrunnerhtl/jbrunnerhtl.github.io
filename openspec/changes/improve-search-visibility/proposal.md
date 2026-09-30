## Why

The portfolio already has canonical URLs, alternates, a sitemap and JSON-LD. It still doesn't show up when someone searches for "Jan Brunner" or "jbrunnerhtl", on Google or on Bing, which also powers DuckDuckGo, Ecosia and Yahoo. The main reasons are outside the page markup:

- **Address.** The site is served from a project subpath with a typo, `jbrunnerhtl.github.io/personal-wesite3.0/`. Crawlers only read `robots.txt` at the host root, and that returns 404. So the sitemap is never discovered on its own.
- **Search engines.** The site isn't registered with any search engine. Google verification is supported but not configured, Bing isn't supported at all, and nothing tells search engines when the site changes.
- **Links to the site.** Almost nothing links to it. The GitHub profile's "Website" field is empty, and only the profile README links to it.
- **Structured data.** The `Person` has no image, no given or family name and no job title. The projects aren't described at all, so searches for a project name ("Flashcards HTL Leonding", "Crow demo backend") can't lead to the site.

## What Changes

- **BREAKING (URL):** Move the site to the GitHub user site `https://jbrunnerhtl.github.io/` by renaming the repository to `jbrunnerhtl.github.io`. The deploy workflow already builds these repositories without a base path. `robots.txt` and `sitemap.xml` then live at the host root, where crawlers find them. Old `/personal-wesite3.0/…` URLs stop working. This is acceptable because the site is days old and has no search index entries yet.
- Optional **Bing Webmaster Tools** verification (`msvalidate.01`), set at build time like the existing Google token. Both verification tags are also emitted on the root page `/`, which is the page search consoles check for a root URL.
- **IndexNow:** the deploy workflow notifies IndexNow (Bing, Yandex, Seznam, Naver and others) of the page URLs after each deployment triggered by a push or a manual run. The site serves the matching key file.
- **Richer structured data:**
  - The `Person` gets the profile picture, given and family name, a job title per language and a URL for HTL Leonding.
  - The `ProfilePage` gets `dateModified`.
  - The featured projects become `SoftwareSourceCode` entries (name, description, repository, language, author).
- **Manual steps**, documented in the tasks and the README:
  - Rename the repository.
  - Set the GitHub profile "Website" field and the repository homepage to the new URL, and update the link in the profile README.
  - Verify the site in Google Search Console and submit the sitemap.
  - Import the site into Bing Webmaster Tools.
- Refresh comments and spec examples that name `/personal-wesite3.0`.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `search-engine-optimization`:
  - "Site URL and Canonical Pages" now names the root user-site URL.
  - "Sitemap and Robots" is now effective at the host root.
  - "Structured Data" gets the richer `Person`, `dateModified` and the projects.
  - "Search Console Verification" adds Bing.
  - New requirement "Search Engine Change Notification" (IndexNow).
- `site-deployment`:
  - "Automated Static Deployment": the scenario names the user site's URL.
  - "Least-Privilege CI": the IndexNow notification runs in its own job, without permissions and without project code.

## Impact

- **GitHub (manual):**
  - Rename the repository.
  - Update the Pages URL, the profile "Website" field, the repository homepage and the profile README link.
  - Update the local git remote.
- `.github/workflows/deploy.yml`:
  - `NEXT_PUBLIC_BING_SITE_VERIFICATION` from `vars.BING_SITE_VERIFICATION`.
  - A `notify` job after `deploy` for IndexNow.
- `src/app/[lang]/layout.tsx`, `src/app/(root)/layout.tsx` and `src/lib/site.ts`: shared verification metadata (Google and Bing).
- `src/components/seo/StructuredData.tsx`, `src/data/portfolioData.ts` and `src/i18n/dictionaries/*`: job title and extra structured data.
- New `public/<indexnow-key>.txt`, with the same key in the workflow.
- Comments in `next.config.ts`, `src/lib/basePath.ts`, `src/lib/site.ts`, `src/app/robots.ts` and `README.md`.
- No new dependencies. Nothing changes for visitors except the address.
