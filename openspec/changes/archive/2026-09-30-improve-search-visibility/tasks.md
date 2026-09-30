## 1. User-site URL

- [x] 1.1 Update the comments that name `/personal-wesite3.0` in `next.config.ts`, `src/lib/basePath.ts`, `src/lib/site.ts` and `.github/workflows/deploy.yml`. They should describe the user site (no base path) and keep project sites and custom domains as the alternatives. Verify with `grep -rn "personal-wesite3.0" --exclude-dir={node_modules,.next,out,.git,archive} .`, which should then only find the delta spec's history, if anything.
- [x] 1.2 Update the comment in `src/app/robots.ts`: on the user site, `robots.txt` is at the host root and takes effect. Build locally with `NEXT_PUBLIC_SITE_URL=https://jbrunnerhtl.github.io` and no `NEXT_PUBLIC_BASE_PATH`. Verify that:
  - `out/robots.txt` names `https://jbrunnerhtl.github.io/sitemap.xml`
  - `out/sitemap.xml` lists `https://jbrunnerhtl.github.io/en/` and `/de/`
  - `/de/` has the canonical `https://jbrunnerhtl.github.io/de/`

## 2. Search engine verification

- [x] 2.1 Add a helper in `src/lib/site.ts` that returns the `verification` metadata:
  - `google` from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  - `other["msvalidate.01"]` from `NEXT_PUBLIC_BING_SITE_VERIFICATION`
  - each only when it is set

  Use the helper in `src/app/[lang]/layout.tsx` and `src/app/(root)/layout.tsx`. Verify with a build that uses dummy tokens: `out/index.html`, `out/en/index.html` and `out/de/index.html` contain both meta tags, and a build without tokens contains neither.
- [x] 2.2 Pass `NEXT_PUBLIC_BING_SITE_VERIFICATION: ${{ vars.BING_SITE_VERIFICATION }}` to the build step in `deploy.yml`, with a comment next to the Google one. Verify by reviewing the workflow diff (action pins and permissions unchanged).

## 3. IndexNow

- [x] 3.1 Generate a 32-character hex key once. Add `public/<key>.txt` containing the key, and add `INDEXNOW_KEY` to the workflow's top-level `env`. Verify that `out/<key>.txt` exists after a build and contains exactly the key.
- [x] 3.2 In the `build` job:
  - expose the computed site URL as a job output (`site`)
  - add a step after the build that fails when `out/$INDEXNOW_KEY.txt` is missing

  Verify by running the step's shell command locally against `out/`, once with the file and once without.
- [x] 3.3 Add a `notify` job:
  - `needs: [build, deploy]`, `if: github.event_name != 'schedule'`, `permissions: {}`, no checkout
  - one `curl --max-time 30` POST to `https://api.indexnow.org/indexnow` with `host`, `key`, `keyLocation` and `urlList` (`<site>/en/` and `<site>/de/`), built from `needs.build.outputs.site`
  - on failure, print `::warning::` and exit 0

  Verify that the JSON the step builds is valid by running its shell part locally with `echo` instead of `curl`. Check `permissions: {}` and the `if` condition in the diff.
- [x] 3.4 Document IndexNow (what it does, where the key lives, that the daily rebuild doesn't notify) in the README's deploy section. Verify by reading the README.

## 4. Structured data

- [x] 4.1 Add the following fields. Verify with `npx tsc --noEmit`, which also checks that the German dictionary has the same shape.
  - `givenName`, `familyName` and `schoolUrl` (`https://www.htl-leonding.at/`) to `PORTFOLIO_DATA.profile`
  - `profile.jobTitle` to `en.ts` ("Software Development Student") and `de.ts` ("Schüler der Softwareentwicklung")
- [x] 4.2 Extend `StructuredData.tsx`:
  - `Person`: `givenName`, `familyName`, `jobTitle`, `image: siteUrl("icon.png")`, and `url` on the `EducationalOrganization`
  - `ProfilePage`: `dateModified` (build time, ISO 8601) and `hasPart` → project `@id`s
  - one `SoftwareSourceCode` per featured project: `@id` and `codeRepository` = repository URL, localized `name` and `description`, `programmingLanguage`, `url` = demo site or repository, and `author` → person
- [x] 4.3 Verify the JSON-LD in the built `out/en/index.html` and `out/de/index.html` with a small script (scratchpad):
  - it parses
  - every `@id` reference resolves
  - six `SoftwareSourceCode` nodes with the correct language are present
  - the image URL returns an existing file in `out/`
  - no email address appears

## 5. Checks and handover

- [x] 5.1 Run `npx next typegen && npx tsc --noEmit && npm run lint && npm run build` (the same checks as CI). Verify that all of them pass.
- [x] 5.2 Check in WebKit (the owner uses Safari) that the local build of `/en/` and `/de/` still looks and behaves unchanged (hero, journey, stacked fallback). Verify with screenshots compared to `main`.
- [x] 5.3 Commit locally (no push). Then hand the owner the manual steps from the design's migration plan as a checklist:
  - rename the repository and run `git remote set-url`
  - push, or run the workflow manually, right after renaming
  - set the profile "Website" field, the repository homepage and the profile README link
  - Google Search Console: URL-prefix property, token in `vars.GOOGLE_SITE_VERIFICATION`, submit the sitemap, request indexing
  - Bing Webmaster Tools: import from Google Search Console

  Verify that the owner has the checklist.
- [x] 5.4 After the owner's first deployment on the user site: `curl` checks that `https://jbrunnerhtl.github.io/robots.txt`, `/sitemap.xml`, `/<key>.txt`, `/en/` and `/de/` return 200, and that the `notify` job ran without a warning. Report the results to the owner.
