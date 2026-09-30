## Context

- **Architecture today:** the site is a Next.js 16 static export (`output: "export"`). Root layouts are `app/[lang]` and `app/(root)`, plus `global-not-found.tsx`. `I18nProvider` swaps copy in place, both dictionaries ship to the client, and the language switch uses `history.replaceState`.
- **What goes away:** the whole page is built around the journey:
  - `JourneyProvider`, `journeyStore`, `Station` wrappers and `motionStore`
  - Lenis in `SmoothScrollProvider`
  - the space scene in `components/3d/*`
  - a `useJourney()` branch in Navbar, Hero, Projects, Skills and StatsStation
  - roughly 450 lines of station and effect CSS in `globals.css`

  None of it carries over. The GLSL noise in `noise.glsl.ts` is reusable for the sphere.
- **Reveals:** `FadeIn`/`Stagger` in `MotionWrapper` use framer-motion `initial={{opacity:0}}`, which is server-rendered as inline `opacity:0`. Without JavaScript the content stays invisible, and the new reveal spec forbids that.
- **Data:** `PORTFOLIO_DATA.projects` has id, repo, language, stack, year, team size and URLs. The dictionaries hold title and long description per project. There is no short summary, feature list or build description, and no source code.
- **Owner's decisions:**
  - full hamishw.com-style layout
  - stylized code mockups instead of screenshots
  - project detail pages
  - light and dark mode with a toggle
  - the GitHub profile picture in About
- **Sequencing:** the `improve-search-visibility` change (user-site URL, verification, IndexNow, richer JSON-LD) is committed on the base branch and is archived before this one.

## Goals / Non-Goals

**Goals:**
- A layout and interaction model close to the template, built from our own components and branding.
- Everything readable without JavaScript and for assistive technology.
- 3D only in the hero, costing nothing once it is off screen.
- Detail pages with real, verified content in both languages.

**Non-Goals:**
- No blog or articles section, and no contact form (a static host has no backend). Contact stays email and GitHub.
- No real screenshots or 3D device models.
- No per-project preview images; the project pages reuse the language image.
- No CMS; content lives in TypeScript data and dictionaries.
- No reuse of the template's source files, logo, lettering, photo or copy.

## Decisions

### 1. Page structure and routing
- **Layout:** `app/[lang]/layout.tsx` renders `<Sidebar/>`, the top-right controls and `{children}` inside `I18nProvider` and `ThemeProvider`. There is no global background canvas anymore.
- **Home page:** `app/[lang]/page.tsx` runs Hero → six `ProjectSection`s → `MoreRepos` → `About` → `SkillsTimeline` → `Contact` → footer.
  - Section ids: `projects` (the first project section), `about`, `skills` and `contact`.
- **Project pages:** `app/[lang]/projects/[slug]/page.tsx` uses `generateStaticParams` over locales × slugs and `dynamicParams = false`.
- **Transitions:** `app/[lang]/template.tsx` gives each navigation a short opacity fade. It is CSS-only and skipped under reduced motion.
- **Navigation:**
  - In-app links use `next/link`, so scroll restoration on Back is Next's built-in behavior.
  - Section links from a project page point to `/<lang>/#<id>`.
  - On the home page they call `scrollIntoView({behavior})` and move focus to the section heading (`tabIndex=-1`).
- *Alternative:* keep Lenis. Rejected: native scrolling is what the template uses, it avoids fighting route changes and scroll restoration, and it removes a dependency.

### 2. Color modes
- **Attribute:** the mode lives in `data-theme="dark|light"` on `<html>`.
- **Pre-paint script:** a tiny inline script in `<head>` of all three root layouts (`[lang]`, `(root)`, `global-not-found`) runs before paint. It reads `localStorage.theme` in a try/catch, falls back to `matchMedia('(prefers-color-scheme: light)')`, then sets the attribute.
- **Hydration:** `<html suppressHydrationWarning>`, because the attribute differs from the server HTML.
- **Toggle:** `ThemeProvider` exposes the mode and a `toggle()`. `toggle()` writes the attribute and `localStorage`, and wraps the change in `document.startViewTransition` for the cross-fade (instant under reduced motion or when unsupported). It also updates `<meta name="theme-color">`.
- **Tokens:** `globals.css` defines `--bg`, `--fg`, `--muted`, `--faint`, `--line`, `--accent` (fill), `--accent-fg` (text on the accent fill), `--accent-text` (accent used as text, darker in light mode for contrast) and `--surface`. They are set under `:root` (dark) and `:root[data-theme=light]`.
- **Palette:**
  - Dark: `#111` background with a cyan accent around `oklch(0.85 0.15 205)`.
  - Light: `#f2f2f2` background, the same accent fill, and accent text at about `oklch(0.52 0.11 215)`.
  - Contrast is checked with a script against every text token (see tasks).
- *Alternative:* the `prefers-color-scheme` media query only, without a toggle. Rejected: the owner wants the toggle.

### 3. Typography
- **Text:** Montserrat via `next/font/google` (variable, latin and latin-ext). It is the closest free geometric alternative to the template's Gotham.
- **Code:** Geist Mono stays for code, the section numbers and small labels.
- **Hero:** the name eyebrow is tracked out and uppercase, and the role title uses `clamp()` sizes.

### 4. Hero and the displacement sphere
- **Headings:**
  - `<h1>` is the eyebrow "Jan Brunner" (styled uppercase through CSS `text-transform`, so the text stays "Jan Brunner").
  - The role title is an `<h2>`. Its accessible text is the static "Developer + Student". The visual cycling part is `aria-hidden`, and a sizer with the longest role reserves its width.
- **Role lists:** they live in the dictionaries.
  - EN: Developer + [Student, Backend Builder, App Maker, Problem Solver]
  - DE: Entwickler + [Schüler, Backend-Bastler, App-Bauer, Problemlöser]
  - They are deferrable copy and easy to change.
- **Cycling:** a `useInterval` runs only while the hero is intersecting and the document is visible.
- **Sphere component:** `components/hero/DisplacementSphere.tsx`, a client component loaded through `next/dynamic` (`ssr:false`) after `requestIdleCallback`, only on the home page.
  - Geometry: `SphereGeometry(r, 128, 128)`, with fewer segments on phones.
  - Material: `MeshPhongMaterial({ flatShading: true })` with `onBeforeCompile`. That injects a 3D simplex noise displacement along the normal (`uTime`, `uAmp`) into `begin_vertex`.
  - Faceting: `flatShading` derives normals from screen-space derivatives, which gives the faceted light and shadow look without recomputing normals.
  - Lights: one directional light in the accent color, one white directional light, and a low ambient light.
  - Pointer response: rotation eases towards the pointer with a critically damped spring (`maath/easing`-style damp, written inline). On touch devices, the rotation follows the scroll offset within the hero.
- **Colors:** read from CSS custom properties (`--sphere-base`, `--sphere-light`) on mount and on theme change, through a `MutationObserver` on `data-theme`. The material and light colors update in place.
- **Scroll-out:** the canvas wrapper's opacity and translate follow the hero's scroll progress through one rAF-throttled scroll listener that writes a CSS variable.
- **Rendering:**
  - `frameloop="demand"`. A small driver invalidates every frame only while the hero intersects (`IntersectionObserver`) and `document.visibilityState === "visible"`.
  - The clock only advances on rendered frames.
  - Reduced motion renders exactly one frame after the colors are set.
  - DPR is `[1, 1.5]`, or `[1, 1.25]` below 768px.
- **Fallback:** `SphereFallback` is a CSS radial and conic gradient blob in the same place. It is the server-rendered placeholder, and it stays when `prefersStaticBackground()` or no WebGL (crawler, save-data, low-end). The canvas fades in over it.
- **Dependencies:** `@react-three/fiber` and `three` stay. `@react-three/drei` goes, as it is no longer used.
- *Alternative:* a CSS-only blob. Rejected as the main effect: the template's defining piece is the lit, deforming 3D shape.

### 5. Reveal and scramble effects without hiding content from non-JS readers
- **Scripted class:** the pre-paint script also adds `class="js"` to `<html>`.
- **Reveal:** `[data-reveal]` elements are hidden only under `html.js` (`opacity:0; translate: 0 1.5rem`). A single `useReveal()`, one `IntersectionObserver` per page, adds `data-revealed` once, and CSS transitions them in.
  - Stagger comes from a `--i` custom property as `transition-delay`.
  - Dividers draw with `scale-x`.
  - Under `prefers-reduced-motion` the CSS shows everything immediately.
- **Scramble:** `<DecoderText text>` renders the final text in an `sr-only` span plus an `aria-hidden` visual span.
  - In the server HTML the visual span holds the final text.
  - On reveal, a rAF loop replaces not-yet-settled characters with random glyphs from a code-ish set (`0123456789{}[]<>/\\#$%&*+=_~;:`), settling left to right over about 1s.
  - Spaces are kept, so line breaks don't jump.
  - Reduced motion skips the loop.
- The template's katakana glyph set and lettering are not reused.
- `MotionWrapper` (framer reveals) and `RevealText` are deleted.
- framer-motion stays only for the full-screen menu's staggered links and the language pill, where the content is already visible or interactive. If that turns out unnecessary during implementation, it can go too.

### 6. Sidebar and menu
- **Wide screens (≥1024px):** a fixed `<nav>` on the left, about 6rem wide. The page content gets matching left padding.
  - Links are written vertically with `writing-mode: vertical-rl; rotate: 180deg`, which keeps real text and a correct focus ring.
  - The active section comes from one `IntersectionObserver` over the section ids, using the middle band of the viewport.
  - Hover and focus draw an accent underline along the text (`scale-y` from the top).
- **Top right:** the language pill and the theme toggle (moon or sun icon, `aria-pressed` and a localized `aria-label`).
- **Narrow screens (<1024px):** a top bar with the monogram and a menu button.
  - The menu is a full-screen `role="dialog" aria-modal` panel with large links, the language switch, the theme toggle, and the GitHub and email links.
  - Focus is trapped while open, and it closes on Escape, link click or crossing the breakpoint. The body doesn't scroll while it is open.

### 7. Project sections and mockups
- **Data model:** `PORTFOLIO_DATA.projects[i]` gains:
  - `slug` (equal to the id)
  - `mockup: { kind: "laptop" | "window" | "terminal", file: string, snippet: SnippetId }`
  - `details: SnippetId[]`
- **Snippets:** `src/data/snippets.ts` holds each excerpt with `lang` (shiki grammar), `file` (repo path), `repo` and `code`. Each excerpt comes from the repository's default branch and is trimmed to about 16–24 lines, with `// …` marking omissions. The terminal snippet for Crow is a `curl` request and the JSON response, taken from the backend's routes and seed data (run locally if feasible, otherwise derived from the source and marked as such in the snippet's comment).
- **Highlighting:** a server-only module calls `shiki`'s `codeToHtml` with `themes: { dark: "github-dark-default", light: "github-light-default" }`, `defaultColor: false` and the JavaScript regex engine (no WASM). CSS picks `--shiki-dark` or `--shiki-light` by `data-theme`. It runs at build time in the server page components, and the resulting HTML strings are passed as props. No highlighter reaches the client.
- **Frames:** `components/mockups/{Laptop,Window,Terminal}.tsx` are CSS-only.
  - The laptop has a screen with bezel and a base. On reveal, its lid opens from `rotateX(-90deg)` to `0` with perspective.
  - Windows and terminals rise in.
  - Code blocks scroll horizontally inside the frame, never the page.
  - Each frame has `role="img"` wrapping only the decorative chrome, plus an `aria-label` such as "Excerpt of CardSelector.java".
  - The code itself stays readable text.
- **Decorative lettering:** each section's main language (e.g. "JAVA", "C#") is set in a huge outlined font (`-webkit-text-stroke`, transparent fill, low opacity) behind the mockup. It is `aria-hidden` and real DOM text, not generated content, and it is checked in WebKit.
- **Buttons:** the angled corner comes from `clip-path: polygon(...)` on the accent button, with a hover shift and an arrow nudge. The divider with number is an inline SVG (line plus notched bar) plus the number in `--accent-text`.

### 8. Project pages content
- **Copy:** each dictionary gets per-project `summary`, `intro`, `features: string[]`, `built: string[]` (paragraphs), `snippetNotes` (captions) and the shared labels (`facts`, `features`, `built`, `next`, `solo`, `github`, `back`).
- **Sources:** the content is researched from each repository's README and source during implementation, in English first and then German. The existing long description becomes the intro, possibly lightly edited.
- **Rendering:** the page renders from `t` in a client component, so an in-place language switch works. Highlighted snippet HTML is computed on the server and passed in. It is the same in both languages, except for the captions.
- **Metadata:** `generateMetadata` per slug and lang: title, description, canonical, alternates and OG.
- **JSON-LD:** a `ProjectStructuredData` renders `SoftwareSourceCode` with the page URL, repository, language and `author` → the person `@id` from the home graph (same `SITE_URL/#person`).
- **Language switch:** `switchLang` replaces the leading `/<lang>/` segment of `location.pathname` (after `BASE_PATH`) instead of always going to the language home.

### 9. SEO touch points
- **Sitemap:** `sitemap.ts` adds 12 project URLs with alternates.
- **Home JSON-LD:** `StructuredData` switches each project's `url` to its detail page (the repository stays as `codeRepository`) and uses `summary` as the description.
- **Preview image:** the OG route redraws in the new look: dark `#111`, a soft accent sphere gradient, the eyebrow name, the role title and a divider.
- **Crawlers:** the crawler regex stays, but only to skip the sphere.

### 10. Removal and cleanup
- **Deleted:**
  - `components/3d/*` except `noise.glsl.ts`, which moves to `components/hero/`
  - `components/journey/*`, `lib/journeyStore.ts`, `lib/stationGalaxies.ts`, `lib/motionStore.ts` and `lib/random`
  - `SmoothScrollProvider`, `NameSwap`, `SkillMarquee`, `StatsStation`, `SectionHeader` (replaced), `AnimatedCounter` (kept if it still fits the count-up), `MotionWrapper` and `Navbar`
- **Dependencies:** remove `lenis` and `@react-three/drei`; add `shiki`.
- **CSS:** `globals.css` is rewritten around the tokens, the reveal, the mockups and the sidebar.
- **Unused `public/*.svg`:** `file.svg`, `globe.svg`, `next.svg`, `vercel.svg` and `window.svg` are removed.

## Risks / Trade-offs

- **[The site looks derivative of the template]** → The owner explicitly asked for this layout. Our own monogram, copy, glyph set, language lettering, colors tuned to our tokens and the code mockups keep it from being a clone. The template's code is not copied.
- **[Large rewrite touching almost every file]** → The work is ordered so the site builds after each task group: foundations (tokens, theme, layout shell) first, then sections one by one, then pages, then removal of dead code. Each group ends with lint, typecheck, build and WebKit screenshots.
- **[shiki in the build (size, Turbopack compatibility)]** → It runs only in server code. If Turbopack has trouble bundling it, fall back to precomputing highlighted HTML with a small Node script into a generated TS file, checked in.
- **[Theme flash or hydration mismatch]** → The inline pre-paint script plus `suppressHydrationWarning` on `<html>` only. Verified by loading with a light system scheme in WebKit and taking screenshots before hydration.
- **[Sphere performance on weak GPUs]** → Fewer segments on phones, the DPR cap, rendering only while in view, and the static fallback for low-end and save-data.
- **[Copy volume (six projects × two languages, features, build notes) and accuracy]** → Written from the READMEs and source files, with the repository path noted for each snippet. The owner reviews the German copy.
- **[Removing the journey loses work]** → It is in git history, and the archived OpenSpec changes document it.

## Migration Plan

1. Archive `improve-search-visibility` first; its delta is the base of this change's SEO delta. If its last task (a post-deploy check) is still open, it is archived together with this change's archive, in that order.
2. Implement on `feature/portfolio-redesign` and commit locally per task group. No push.
3. The owner reviews in the browser (the dev server or a static build), then merges and pushes as usual.
4. After archiving, the now-empty `openspec/specs/station-journey/` is deleted, and the `Purpose` lines of `canvas-3d-experience` and `portfolio-ui` are updated to the new reality.
5. Rollback: revert the merge. The previous site is fully in history.

## Open Questions

- **Role words and German phrasing** (e.g. "Backend-Bastler"). This is copy; it can be adjusted any time without touching specs or structure.
- **Exact accent hue.** It is a token and gets tuned during implementation against the contrast check.
