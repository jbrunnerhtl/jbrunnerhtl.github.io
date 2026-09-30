## Context

- This builds on the archived `add-search-engine-optimization` change. The site already has absolute canonical URLs, alternates, a preview image, JSON-LD (`WebSite`, `ProfilePage`, `Person`), a sitemap and robots, and optional Google verification.
- The deploy workflow already sets the site URL. For a repository named `*.github.io` it uses no base path and `https://<owner>.github.io`, so moving to the user site needs no code change in the workflow's path logic.
- `jbrunnerhtl.github.io` currently has no user-site repository. The host root returns 404 for `/` and `/robots.txt`. `jbrunnerhtl.github.io/Driving_Tracker_Java_Docs/` is another project site on the same host, and it keeps working after the move.
- The static export already writes `out/robots.txt`, `out/sitemap.xml`, `out/404.html`, `out/icon.png` (256×256 profile picture) and `out/apple-icon.png` at the export root.
- Project titles and descriptions are in the dictionaries (`projects.items.<id>`). Repository URLs and languages are in `PORTFOLIO_DATA.projects`.
- Project rule: changes are committed locally only. The owner pushes and does the GitHub settings by hand.

## Goals / Non-Goals

**Goals:**
- The site is served from the host root, so crawlers find `robots.txt` and the sitemap.
- Google and Bing can be verified from repository variables.
- IndexNow is notified on content deployments.
- The JSON-LD describes the person more completely and describes the projects.
- The manual steps outside the repository are listed and explained.

**Non-Goals:**
- No redirect from the old `/personal-wesite3.0/` URLs. That would need a second repository with the old name, and the site has no indexed URLs or known external links there apart from the profile README, which gets updated.
- No custom domain. `vars.SITE_URL` keeps that option open.
- No per-project subpages, no copy rewrite, no analytics.
- No `llms.txt` or other AI-crawler-specific files.
- No sitemap ping to Google, which Google retired in 2023. Google learns about the site through Search Console and `robots.txt`.

## Decisions

### 1. User site by renaming this repository
- The owner renames `personal-wesite3.0` to `jbrunnerhtl.github.io`. GitHub then serves the Pages site at `https://jbrunnerhtl.github.io/`. The workflow computes `path=""` and `site=https://jbrunnerhtl.github.io`.
- In the repository, only comments and spec examples that name `/personal-wesite3.0` change. The `basePath` support stays, so project-site builds and custom domains still work.
- *Alternative:* a new, separate `jbrunnerhtl.github.io` repository with the same code. This was rejected because it duplicates history and settings (Pages source, environment, variables, Dependabot).
- *Alternative:* a custom domain. The owner chose the free user site.

### 2. Bing verification next to Google, on the root page too
- A small helper in `src/lib/site.ts` builds the `verification` metadata:
  - `google` from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  - `other["msvalidate.01"]` from `NEXT_PUBLIC_BING_SITE_VERIFICATION`
  - each only when it is set
- Both root layouts (`[lang]` and `(root)`) use this helper. A URL-prefix property `https://jbrunnerhtl.github.io/` is verified on `/`, the language chooser, which today carries no verification tag.
- The verifiers read the raw HTML, and the tag sits in the static `<head>` before the redirect script runs.
- The workflow passes `vars.BING_SITE_VERIFICATION`.
- Bing Webmaster Tools can also import a site that is already verified in Google Search Console, with no token at all. The token remains the fallback when that import isn't available.
- Bing's index also serves DuckDuckGo, Ecosia and Yahoo, so no separate registration is needed for those.

### 3. IndexNow in a separate `notify` job
- A fixed IndexNow key (32 hex characters, generated once) goes in two places:
  - the workflow's top-level `env` as `INDEXNOW_KEY`
  - `public/<key>.txt`, whose content is the key
- The key is public by design. IndexNow only checks that the key file exists on the host.
- The build job fails if `out/$INDEXNOW_KEY.txt` is missing, so the two copies can't drift apart unnoticed.
- The `build` job exposes the computed site URL as a job output.
- A new `notify` job:
  - runs with `needs: [build, deploy]`, `if: github.event_name != 'schedule'` and `permissions: {}`
  - has no checkout; it makes one `curl` POST to `https://api.indexnow.org/indexnow` with JSON `{host, key, keyLocation, urlList: [<site>/en/, <site>/de/]}`
  - uses `--max-time 30`
  - on HTTP errors, prints `::warning::` and exits 0
- The `api.indexnow.org` endpoint shares submissions with all participating engines.
- *Alternative:* a step in the `deploy` job. This was rejected because the deploy job should hold Pages permissions and nothing else, and the notification needs none.
- *Alternative:* keeping the key as a repository variable and writing the file at build time. This was rejected because it is more moving parts for a value that is public anyway.

### 4. Structured data additions
- `PORTFOLIO_DATA.profile` gets `givenName: "Jan"`, `familyName: "Brunner"` and `schoolUrl: "https://www.htl-leonding.at/"`.
- The dictionaries get `profile.jobTitle`:
  - English: "Software Development Student"
  - German: "Schüler der Softwareentwicklung"
- `Person` adds:
  - `givenName`, `familyName` and `jobTitle`
  - `image: siteUrl("icon.png")`, the site's own copy of the profile picture, so it doesn't depend on GitHub's avatar URL
  - `url` on the `EducationalOrganization`
- `ProfilePage` adds `dateModified` (build time, ISO 8601). The daily rebuild updates it along with the stats.
- One `SoftwareSourceCode` node per featured project:
  - `@id` = repository URL, `name`, `description` (in the page's language), `codeRepository`
  - `programmingLanguage` = the project's main language
  - `url` = the demo site if there is one, otherwise the repository
  - `author: { "@id": person }`
- The `ProfilePage` lists the projects in `hasPart`, so the graph stays connected.
- The escaping and the rule to leave out the email stay as they are.

### 5. Documentation of the manual steps
- The README's deploy section describes the user-site setup. It lists the one-time steps: repository variables, Search Console, Bing import, GitHub profile "Website" field, repository homepage and the profile README link.
- `tasks.md` repeats them as tasks to tick off.

## Risks / Trade-offs

- **[The live site serves the old build at the root until the next deploy after the rename: assets under `/personal-wesite3.0/_next/…` are missing, so the page is unstyled]** → Push (or run the workflow manually) right after renaming. The migration plan orders the steps.
- **[Old links to `/personal-wesite3.0/` return 404]** → The profile README link is updated. There are no known search index entries yet. The 404 page links to the home page.
- **[IndexNow key and key file drift apart]** → The build job checks that the file exists.
- **[Google ignores IndexNow]** → Google is covered by Search Console verification, sitemap submission and `robots.txt`. IndexNow is for Bing and the other engines.
- **[Visibility still depends on off-page signals (links, time)]** → The GitHub profile "Website" field, the repository homepage and the profile README all point to the site. Beyond that, ranking for a common name can't be guaranteed.

## Migration Plan

1. Implement and commit locally, and check with a local build that uses `NEXT_PUBLIC_SITE_URL=https://jbrunnerhtl.github.io` and no base path.
2. Owner, on GitHub: rename the repository to `jbrunnerhtl.github.io`, then run `git remote set-url origin git@github.com:jbrunnerhtl/jbrunnerhtl.github.io.git` locally.
3. Owner: push `main`. The workflow deploys to the root and notifies IndexNow.
4. Owner: set the profile "Website" field and the repository homepage to `https://jbrunnerhtl.github.io/`, and update the profile README link.
5. Owner: add a URL-prefix property `https://jbrunnerhtl.github.io/` in Google Search Console and copy the HTML-tag token into `vars.GOOGLE_SITE_VERIFICATION`. Then re-run the workflow, verify, submit `sitemap.xml` and request indexing for `/en/` and `/de/`.
6. Owner: import the site from Google Search Console in Bing Webmaster Tools, or use `vars.BING_SITE_VERIFICATION`.
7. Rollback: rename the repository back. The workflow builds with the base path again.
