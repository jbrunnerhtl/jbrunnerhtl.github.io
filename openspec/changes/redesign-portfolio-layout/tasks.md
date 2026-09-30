## 1. Foundations: tokens, fonts, color modes, effects

- [x] 1.1 Read the bundled Next docs for `template.tsx`, `next/font` and metadata `themeColor` in `node_modules/next/dist/docs/`. Add `shiki` as a dependency. Verify that `npm ls shiki` shows it and `npm run build` still passes.
- [x] 1.2 Switch the text font to Montserrat via `next/font/google` in `src/app/fonts.ts`, keeping Geist Mono for code and labels. Verify with a build and a WebKit screenshot of the hero that Montserrat is rendered.
- [x] 1.3 Rewrite the color tokens in `globals.css`:
  - dark on `:root`, light on `:root[data-theme=light]`
  - `--bg`, `--fg`, `--muted`, `--faint`, `--line`, `--surface`, `--accent`, `--accent-fg`, `--accent-text`, `--sphere-base`, `--sphere-light`
  - shiki variables per mode

  Add a scratchpad contrast script. Verify that every text token reaches ≥4.5:1 against `--bg` and `--surface`, and `--accent-fg` against `--accent`, in both modes.
- [x] 1.4 Add the pre-paint theme script (`localStorage.theme`, then the system scheme; also sets `html.js`) to the `[lang]` and `(root)` layouts and to `global-not-found.tsx`, with `suppressHydrationWarning` on `<html>`. Add `ThemeProvider`, which provides `useTheme()` and `toggle()` with a view-transition cross-fade and saves the choice. Verify in WebKit:
  - light system scheme → the first screenshot is light before hydration
  - toggle → the choice persists across a reload
  - reduced motion → no cross-fade
- [x] 1.5 Add `useReveal()` (one IntersectionObserver, `data-reveal` → `data-revealed`, stagger via `--i`, CSS hidden only under `html.js`, shown under reduced motion) and `<DecoderText>` (sr-only final text plus `aria-hidden` scrambling span, code-ish glyph set). Verify on a test section in WebKit:
  - with JavaScript, content reveals on scroll
  - with JavaScript disabled, everything is visible
  - with reduced motion, no animation
  - the accessibility tree reads only the final text

## 2. Layout shell: remove the journey, add sidebar and menu

- [x] 2.1 Remove the journey and the space scene:
  - `JourneyProvider`, `Station`, `StatsStation`, `journeyStore`, `stationGalaxies` and `motionStore`
  - `components/3d/*` (move `noise.glsl.ts` to `components/hero/`) and `Background`
  - `SmoothScrollProvider` and Lenis
  - every `useJourney()` branch and the journey CSS

  Sections keep their current (stacked) rendering for now. Verify with `npx tsc --noEmit`, lint, build, and `grep -rn "journey\|lenis\|motionStore" src`, which should return nothing.
- [x] 2.2 Build `Sidebar`:
  - Wide screens (≥1024px): monogram, vertical section links with active-section highlight and hover/focus accent line, GitHub and email icons at the bottom, and top-right controls (language pill and theme toggle).
  - Narrow screens: top bar with monogram and menu button, plus a full-screen menu dialog with focus trap, Escape/link/breakpoint close and body scroll lock.

  Delete `Navbar`. Verify in WebKit at 1440, 1024, 768, 390 and 320px (no horizontal overflow, 44×44px targets on touch). Verify with the keyboard: Tab order, focus trap and Escape.
- [x] 2.3 Make in-page section links smooth-scroll natively and move focus to the section heading (instant with reduced motion). From other pages, links go to `/<lang>/#id`. Verify that clicking each sidebar link lands on its section, and that opening `/en/#contact` directly lands on Contact.
- [x] 2.4 Make `switchLang` keep the current path, mapping `/<lang>/…` to the other language, and add `app/[lang]/template.tsx` with a CSS fade (none under reduced motion). Verify by switching language on the home page (scroll position kept) and later on a project page (task 6.x re-checks this).
- [x] 2.5 Commit locally ("Replace the space journey with a sidebar layout shell"). Verify that `git log -1` shows the commit and the build passes.

## 3. Hero and displacement sphere

- [x] 3.1 Rebuild `HeroSection`:
  - `<h1>` "Jan Brunner" as a tracked uppercase eyebrow
  - an `<h2>` role title (big role word plus line, and "+ role" cycling every ~3s with `DecoderText`), with a stable accessible text and a width reserved by a sizer
  - a CSS entrance on first paint
  - a scroll indicator to `#projects`
  - cycling paused while off screen or the tab is hidden, and no cycling with reduced motion

  Add the role lists to both dictionaries. Verify in WebKit:
  - the `<h1>` text in `out/en/index.html` is exactly "Jan Brunner"
  - no layout shift while cycling
  - the accessibility text stays stable
- [x] 3.2 Build `DisplacementSphere`:
  - r3f canvas, a `SphereGeometry` with `MeshPhongMaterial` (`flatShading`, noise displacement via `onBeforeCompile`), accent and white directional lights
  - a spring rotation towards the pointer (scroll-driven on touch devices)
  - colors from `--sphere-*`, updated live on theme change
  - fade and shift out with hero scroll progress
  - demand rendering only while the hero is visible and the tab is visible, one still frame under reduced motion, DPR caps

  Also build `SphereFallback`, a CSS gradient blob used as placeholder and fallback, and load the sphere via `next/dynamic` after idle, home page only, skipped for crawlers, save-data, low-end devices and no WebGL. Verify in WebKit:
  - the sphere renders and follows the mouse
  - it recolors on toggle
  - no frames are rendered after scrolling past the hero (count them with a rAF probe)
  - the fallback shows with WebGL disabled
  - the initial JS of `/en/` excludes three.js (check the build output chunks)
- [x] 3.3 Commit locally ("Add the hero with cycling role and displacement sphere"). Verify that the build passes.

## 4. Projects on the home page

- [x] 4.1 Research each of the six repositories (README, source tree) and pick the mockup material:
  - one excerpt of 16–24 lines per project
  - for Crow, a `curl` request and the JSON response (run locally if feasible, otherwise derived from routes and seed data and noted)
  - one or two detail excerpts per project for its page

  Store them in `src/data/snippets.ts` with repo, file path and language. Verify that each excerpt's lines exist in the named file of the repository (spot-check with `curl` on raw.githubusercontent.com in a scratchpad script).
- [x] 4.2 Add a server-only `highlight()` using shiki `codeToHtml` with dual themes (`defaultColor: false`, JS regex engine), and add the CSS that selects `--shiki-light`/`--shiki-dark` by `data-theme`. Verify that the built HTML contains highlighted spans, that no shiki code appears in client chunks (grep `out/_next/static`), and that both modes are readable in WebKit.
- [ ] 4.3 Build the mockup frames `Laptop` (lid opens on reveal), `Window` and `Terminal`. They are CSS-only, with inner horizontal code scroll, an `aria-label` and the file name or command in the title bar. Verify at 1440 and 390px in both modes that nothing overflows the page, and in WebKit that the lid animation runs once and is skipped with reduced motion.
- [x] 4.4 Extend `PORTFOLIO_DATA.projects` (slug, mockup kind and snippet, detail snippets). Add a `summary` per project to both dictionaries, one sentence verified against the repository. Verify with `npx tsc --noEmit`.
- [ ] 4.5 Build `ProjectSection`:
  - an accent SVG divider with number, then title, summary, language, year and team badge
  - an angled "View project" link to `/<lang>/projects/<slug>/`
  - the mockup, alternating sides and stacking on narrow screens
  - the outlined decorative language lettering (`aria-hidden`, real text)
  - reveals

  Replace `ProjectsSection` with six of these plus the restyled `MoreRepos` list. Verify in WebKit at 1440/1024/390 in both modes, and check that `#projects` targets the first section.
- [ ] 4.6 Commit locally ("Show projects as full-height sections with code mockups"). Verify that the build passes.

## 5. About, skills and timeline, contact

- [ ] 5.1 Rebuild `AboutSection`: a `DecoderText` greeting ("Hi there"/"Servus"), the existing paragraphs, the stats row (count-up, final values in the HTML), and a "Send me a message" link to `#contact`. The profile picture sits in an accent frame with the vertical, outlined handle lettering (`aria-hidden`). Verify in WebKit in both modes and at 390px, and check that the stats in `out/de/index.html` contain the final numbers.
- [ ] 5.2 Build `SkillsTimeline`: the timeline and the skill groups as accessible static lists, side by side on wide screens and stacked on narrow ones. Delete `SkillMarquee`. Verify that there is no overflow from 320 to 2560px, and that the accessibility tree has one named list per group.
- [ ] 5.3 Rebuild `ContactSection`: a `DecoderText` heading, the text, the email with copy button ("Copied!" announcement kept), an angled mail button, GitHub and the follower count, plus a footer (©, school, region). Verify that the copy flow works in WebKit and that the live region announces it.
- [ ] 5.4 Commit locally ("Restyle about, skills and contact"). Verify that the build passes.

## 6. Project detail pages

- [ ] 6.1 Write the project page copy for all six projects (`intro`, `features`, `built`, snippet captions) in English from each README and source, then in German, plus the shared labels. Verify with `npx tsc --noEmit` (the German dictionary has the same shape), and check each feature against the repository (checklist in the scratchpad).
- [ ] 6.2 Add `app/[lang]/projects/[slug]/page.tsx` (`generateStaticParams`, `dynamicParams = false`) with:
  - a header (h1, intro, GitHub and Live links, facts list with language, year, team or solo, and stack)
  - the full-width mockup, then the Features and "How it's built" sections with detail snippets
  - the next-project link and a back link

  Verify that `out/{en,de}/projects/<slug>/index.html` exist for all 12, that an unknown slug gets the 404 page, and that WebKit screenshots at 1440 and 390 in both modes look right.
- [ ] 6.3 Add `generateMetadata` (title "<Project> — Jan Brunner", description, canonical, alternates, OG and Twitter with the language image) and a `SoftwareSourceCode` JSON-LD whose author is the person `@id`. Verify with a scratchpad script over the 12 built pages: canonical, alternates, a single `<h1>` equal to the title, and JSON-LD that parses.
- [ ] 6.4 Verify navigation in WebKit:
  - home → project → Back restores the scroll position
  - next-project from RPN goes to Driving Planner, at the top
  - a language switch on a project page keeps the project
  - sidebar links from a project page go to the home section
- [ ] 6.5 Commit locally ("Add project detail pages"). Verify that the build passes.

## 7. SEO touch points, 404 and preview image

- [ ] 7.1 Extend `sitemap.ts` with the 12 project URLs and alternates, and point each home-page `SoftwareSourceCode` `url` at its detail page with the `summary` as description. Verify that `out/sitemap.xml` lists 14 URLs and that the JSON-LD check script (from `improve-search-visibility`, adapted) passes.
- [ ] 7.2 Redraw the OG image route in the new look (dark, accent sphere gradient, eyebrow name, role title, divider). Verify by opening `out/en/og.png` and `out/de/og.png` (1200×630).
- [ ] 7.3 Restyle `global-not-found.tsx` to the new design and color mode (theme script included). Verify in WebKit that `/de/missing` shows German in light and dark mode, and that the page is still `noindex`.
- [ ] 7.4 Commit locally ("Update SEO, 404 and preview image for the redesign"). Verify that the build passes.

## 8. Cleanup and final checks

- [ ] 8.1 Remove the dead code and assets:
  - `MotionWrapper`, `RevealText`, `NameSwap`, `SectionHeader` and other unused components
  - the `lenis` and `@react-three/drei` dependencies
  - the unused `public/*.svg`
  - leftover CSS

  Verify that `npx next typegen && npx tsc --noEmit && npm run lint && npm run build` pass and that `npx depcheck` (or a grep) shows no unused dependencies.
- [ ] 8.2 Run a WebKit screenshot matrix over `/en/`, `/de/` and two project pages:
  - dark and light, at 1440, 1024, 390 and 320px
  - no-JS, reduced motion, and WebGL disabled

  Review every screenshot, and fix and re-shoot anything broken. Verify that the matrix is clean and that no page errors are logged.
- [ ] 8.3 Commit locally ("Remove leftovers of the space journey"). Report to the owner: screenshots of the key views, what changed, and the German copy to review. The owner merges and pushes.
- [ ] 8.4 At archive time, after `improve-search-visibility` is archived:
  - delete the empty `openspec/specs/station-journey/`
  - update the `Purpose` of `canvas-3d-experience` and `portfolio-ui`
  - verify with `openspec validate --specs`
