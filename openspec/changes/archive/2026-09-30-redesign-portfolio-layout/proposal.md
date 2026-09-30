## Why

The owner wants the portfolio laid out like https://hamishw.com: a calm, editorial one-pager with a fixed side navigation, a large typographic hero over an interactive 3D shape, one full-height section per project with a device mockup, and a detail page for every project. The current scroll-driven space journey is the opposite: only one station is visible at a time, it needs a lot of custom scroll machinery, and there is nothing to link to for a single project. Detail pages also give every project its own URL, which helps search engines (see `improve-search-visibility`).

The template's code is MIT-licensed. We take its layout and interaction patterns and build them ourselves. We don't copy its branding: the "W" logo, the Japanese lettering, the photo and the copy stay his.

## What Changes

- **BREAKING (UI):** Remove the space journey entirely:
  - stations, the scroll timeline, the flight through space, the starfield, galaxies and nebulae
  - the name swap in the hero
  - the skills marquee
  - Lenis smooth scrolling

  The page becomes a normal document with native scrolling and reveal-on-scroll animations.
- **Side navigation:**
  - On wide screens, a fixed left sidebar: the "JB" monogram, vertical section links (Projects, About, Skills, Contact) and the GitHub and email icons at the bottom.
  - Top right: the theme toggle and the language switch.
  - On narrow screens, a menu button opens a full-screen menu.
- **Hero:**
  - "JAN BRUNNER" as a small, letter-spaced heading.
  - A large role word with a line after it, and a second line ("+ …") that cycles through roles with a scramble effect.
  - A scroll indicator.
  - Behind it, an interactive 3D **displacement sphere**: a noise-deformed, lit sphere that slowly morphs and turns towards the pointer, generated in code.
- **Project sections:** one full-height section per featured project, in featured order, with text and mockup alternating sides. Each shows:
  - an accent divider with the number (01–06), the title and a one-sentence summary
  - an angled "View project" button to its detail page
  - a **stylized mockup**: a laptop, app window or terminal showing real code (or real `curl` output) from the repository, syntax-highlighted at build time
  - the project's main language as large decorative outline text behind the mockup
- **Project detail pages** at `/<lang>/projects/<slug>/` for all six projects: title, introduction, links (GitHub, Live), stack and facts list, a large code mockup, and sections on features and how it is built. Written from each repository's README and source, in English and German, with navigation to the next project.
- **About:** the greeting uses a scramble effect ("Hi there" / "Servus"). It holds the existing text, the GitHub stats row and a "Send me a message" link. The profile picture sits in a large accent frame with the handle as vertical decorative text.
- **Skills and timeline:** one section with the milestones and the skill groups as static columns. The more-repositories list follows the projects.
- **Contact:** a closing section with a scramble heading, the email address with copy button, an angled mail button and GitHub. A footer follows.
- **Light and dark mode:**
  - The first visit follows the system setting.
  - The toggle choice is saved and applied before first paint.
  - Both modes get their own palette and sphere colors.
- **New look:**
  - Near-black and near-white backgrounds with a single cyan accent, Montserrat (a free, geometric Gotham alternative) for text, and a mono font for code.
  - The 404 page and the link preview image adopt it.
- The language switch keeps the current page, including the project pages.

## Capabilities

### New Capabilities
- `project-pages`: the per-project detail pages: routes, content, navigation between projects, and their metadata.

### Modified Capabilities
- `portfolio-ui`: dark-only design becomes light/dark with a toggle. The navbar becomes a sidebar and full-screen menu. The hero entrance and name swap become the role cycle. Smooth scrolling becomes native. The contact section and the language switch keep the current page.
- `project-showcase`:
  - Project cards become full-height project sections with mockups.
  - The skills marquee becomes static columns.
  - The live stats move to About and Contact.
- `canvas-3d-experience`: the space flight, starfield and space world are replaced by the hero displacement sphere. On-demand rendering and deferred loading are adapted to it.
- `station-journey`: all requirements are removed. The page no longer has a journey mode.
- `search-engine-optimization`:
  - The sitemap and structured data include the project pages.
  - Each project page has its own canonical URL and heading.
  - The preview image uses the new look.

## Impact

- **Removed:**
  - `src/components/3d/*` (except code reused for the sphere)
  - `src/components/journey/*`
  - `src/lib/journeyStore.ts`, `stationGalaxies.ts` and `motionStore.ts`
  - `SmoothScrollProvider`, `NameSwap`, `SkillMarquee` and `StatsStation`
  - most of `globals.css`
  - the `lenis` dependency
- **New:**
  - sidebar and menu, theme provider and pre-paint script, and the `DisplacementSphere` canvas
  - hero, project section, device mockups and a decoder-text hook
  - `app/[lang]/projects/[slug]/page.tsx`
  - project content and code snippets in `src/data/`
  - the `shiki` dependency (build-time highlighting only, no client JS)
- **Changed:** layouts, all sections, dictionaries (new copy in EN and DE), `sitemap.ts`, `StructuredData`, the OG image, `global-not-found.tsx` and fonts.
- **Sequencing:** builds on `improve-search-visibility`. That change is archived first, and this one's `search-engine-optimization` delta is written against its result.
