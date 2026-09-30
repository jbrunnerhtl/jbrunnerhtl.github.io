## Context

This builds on the archived `scroll-flight-through-space` change. The background is a fixed R3F canvas (`frameloop="demand"`). `FlightDriver` sets the camera's z from `motionStore.scrollPx` and advances `sceneTime`. `GithubCompanion` follows the camera with world-space damping (trail) and bank. `ParticleField` is a z-wrapped point corridor. `ScrimDriver` dims the scene. `Background.tsx` decides whether 3D loads at all (`prefersStaticBackground()` plus a WebGL check in `CanvasContainer`). The DOM is an ordinary stacked page: `page.tsx` renders Hero, About, Projects, Skills and Contact sections in flow. Lenis smooths scrolling, `useScrollTo` scrolls to section ids, and the Navbar marks the active section with an IntersectionObserver. Framer Motion `whileInView` reveals, `AnimatedCounter` and the Skills marquee all key off viewport intersection.

Constraints: static export, EN/DE with in-place language switch, the portfolio-ui rule "translucent surfaces instead of backdrop blur over the canvas", and no downloaded assets for the 3D world. Motivation and required behaviour are in proposal.md and the specs.

## Goals / Non-Goals

**Goals:**
- The whole experience is a pure function of the scroll position: panels, camera and route agree at every pixel, forwards and backwards.
- Zero per-frame React renders. DOM panels and the 3D scene are driven from the same timeline in `requestAnimationFrame` and `useFrame`.
- The stacked page stays the server-rendered source of truth and the fallback. Journey mode is a client-side enhancement.
- Idle costs nothing: no rendering, no DOM writes.

**Non-Goals:**
- No 3D text or WebGL-rendered content. All content stays HTML.
- No free-flight or user-steered camera. Scroll is the only input (the pointer only leans).
- No journey on reduced-motion, save-data, low-end or no-WebGL devices.
- No new dependency (no GSAP/ScrollTrigger, no postprocessing).

## Decisions

### 1. One shared support check, and a journey flag on `<html>`
`prefersStaticBackground()` and the WebGL probe move to `src/lib/sceneSupport.ts`. A client `JourneyProvider` (inside `SmoothScrollProvider`) runs the check once after mount. If 3D will be shown, it sets `data-journey` on `<html>` and exposes `enabled` via context. `Background.tsx` uses the same check. SSR and no-JS therefore render the stacked page. Switching happens at the top of the page on first load, where the hero looks the same in both modes, so the switch is not visible.
- *Alternative, deciding on the server:* impossible, because it depends on client capabilities.

### 2. Fixed stage plus a scroll spacer, not sticky sections
In journey mode each station's content is wrapped in a `Station` element that CSS (`[data-journey] .station`) turns into a full-viewport `position: fixed` layer. `<main>` gets a spacer whose height is the timeline length plus one viewport. The DOM keeps its reading order, so screen readers, search engines and Tab order are unchanged.
- *Alternative, sticky sections in tall wrappers:* rejected. Consecutive sticky wrappers can't overlap, so one station's leave and the next one's arrive can't run at the same time without negative-margin hacks, and a sticky panel physically scrolls away when its wrapper ends.

### 3. The timeline in viewport units
`journeyStore` (a mutable module next to `motionStore`) measures the stations in DOM order and builds a timeline. Each station has `arrive` (0.55 vh), `hold` (0.9 vh plus the content overflow beyond the viewport) and `leave` (0.55 vh). Opacity uses only part of each phase: fade-in over the last 60% of the arrival and fade-out over the first 55% of the departure. That way two blocks of text never sit on top of each other at half opacity, a problem the first screenshots showed. The next station's arrive overlaps the previous station's leave, so `start[i+1] = start[i] + arrive[i] + hold[i]`. The Hero has no arrive (the page starts in its hold), and Contact has no leave (the page ends in its hold).
- It is rebuilt by a `ResizeObserver` on the station contents (covering resize, language switch and font load). After a rebuild, the current position is preserved by keeping the continuous station parameter `u` and scrolling instantly to its new pixel offset.
- Exposed helpers: `phaseAt(px, i)` returns `{ arrive, hold, leave }` progress, `routeU(px)`, `holdPx(i)`, `activeIndex(px)`.

### 4. DOM driver writes transforms directly
A single rAF loop in `JourneyProvider` runs only when `scrollPx` changed. For each station within ±1 of the active one it writes:
- arrive: `scale 0.55→1`, `opacity 0→1`, eased (easeOutCubic)
- hold: `scale 1`, `opacity 1`, and `translateY` from 0 to `-(contentHeight - viewport)` across the hold, for tall content
- leave: `scale 1→1.6`, `opacity 1→0`, eased (easeInCubic)

Stations further away get `opacity 0`. `pointer-events` is enabled only for the held station. `will-change` is set only on the ±1 neighbours. Stations stay in the accessibility tree (no `visibility: hidden` and no `inert`), because focus handling (decision 9) brings them into view.

### 5. Projects render station groups in journey mode
`ProjectsSection` reads `enabled` from the journey context and a `(min-width: 768px)` media query. SSR and stacked mode keep today's header plus grid. Journey mode renders consecutive `Station`s: the header plus the first group, then the remaining groups (2 cards on wide screens, 1 on narrow ones), then the more-repositories list as its own station. The other sections become one `Station` each. React switches once after hydration, with no hydration mismatch because the first client render equals the SSR output.

### 6. Route: a Catmull-Rom curve through station waypoints
`buildRoute(stationCount)` creates one waypoint per station about 42 units apart along −z, with deterministic gentle lateral and vertical offsets (seeded, about ±7 x and ±3 y), so the route turns softly. `THREE.CatmullRomCurve3` (centripetal) goes through them, and waypoint `i` sits at curve parameter `i/(N-1)`.
- `routeU(px)` maps the timeline to `u ∈ [0, N-1]`. `u` is constant at `i` during station `i`'s hold. During the arrive/leave overlap it moves from `i` to `i+1` with smoothstep. This gives slow stations and a faster glide between them, while staying a pure function of scroll.
- `FlightDriver` sets `camera.position = curve.getPointAt(u/(N-1))` and looks at the point `δ = 0.02` further along the curve (clamped at the end), with a small roll from the curve's lateral turn.

### 7. The companion in camera space
The pose becomes a camera-space offset per layout: a "station" offset at the right side (desktop about `(2.6, 0.1, -5.5)`, tablet about `(2.3, 0.6, -5.8)`, mobile about `(1.25, 1.9, -6.2)`, all scaled with aspect as before) and a "destination" offset at the centre `(0, -0.2, -4.5)`, blended in as `u` enters the last segment. The target is `camera.localToWorld(offset)`, and world-space damping plus the lag clamp keep the trail. Orientation is `camera.quaternion × (sway, lean, bank)`, so the logo stays face-on while the camera turns. The per-progress keyframe tables in `sceneLayout.ts` are removed. `sceneLayout()` stays.

### 8. Space world, all procedural
- **Sky:** a `ShaderMaterial` on a back-faced sphere, containing fbm nebula glow in 2–3 palette colours plus hashed faint stars by direction. It is rendered **once per color mode** into a `WebGLCubeRenderTarget` with a `CubeCamera` and used as `scene.background`. It costs nothing per frame, turns with the view and never comes closer. The canvas stays `alpha`, and the static gradient remains behind it for the fade-in.
- **Starfield** (replaces `ParticleField`): points wrapped in a 3D box around the camera in the vertex shader (`p = cam + mod(base - cam + H, 2H) - H`, with H = 40), so it never runs out in any direction. Alpha fades by distance to the camera (near 1.5–4, far 28–40). Each star has a colour (white, blue-white, warm) and a twinkle phase (`sin(uTime·f + φ)`, driven by `sceneTime`). Counts: 8000 on desktop and tablet, 3000 on mobile (H = 30). At the first estimate of 4000/1500 with H = 40, only about 150 stars were in view.
- **Nebula clouds:** 3 noise textures generated once on a 256² canvas (JS fbm) as `CanvasTexture`s. About 14 sprites (`SpriteMaterial`, additive in dark mode, normal in light mode) are placed deterministically beside the route between stations, 18–40 units wide, with palette tints. Each sprite's opacity fades as the camera gets within about 6 units, so no flat quad cuts through the lens.
- **Planets:** one per section (About, Projects, Skills, Contact), placed at their first station's waypoint and offset to the left and ahead in the waypoint frame (desktop `(-22, 4, 34)`, tablet `(-17, 6, 34)`, mobile `(-4, 6, 30)`), so each peeks in beside the panel. The destination planet rises behind the Contact card (`(0, 13, 44)`). Planets fade in between 80 and 58 units from the camera, because the route runs almost straight, and without the fade all planets would line up behind the hero text. One `ShaderMaterial` with a `uType` switch: an ocean/continent world (noise land and water), a banded gas giant (latitude bands plus turbulence), an icy planet with a `RingGeometry` ring (radial band shader, alpha), and a violet "destination" world with strong emission. All share a fixed sun direction for day/night, plus an additive back-face fresnel shell for the atmosphere rim. Sphere segments are 48 on desktop and 32 on mobile.
- **Palettes:** a `SPACE[theme]` table next to the existing `SCENE` holds the sky, nebula, star and planet colours. Light mode uses a pale lavender/sky palette with darker stars, like today's light particles. A theme change re-bakes the sky (keyed like the environment).

### 9. Navigation, focus, reload and hash
- `useScrollTo(id)`: in journey mode it uses `holdPx(firstStationOf(id))`, with a Lenis duration that grows with distance (1.2–2.8s). Otherwise it keeps today's behaviour.
- **Navbar active:** `journeyStore` emits `activesection` only when the held station's section changes. The Navbar subscribes to it in journey mode and keeps the IntersectionObserver in stacked mode.
- **Focus:** a `focusin` listener finds the target's station. If that station is not held, it scrolls there (immediately when the station is adjacent, smoothly otherwise).
- **Reload:** in journey mode `history.scrollRestoration = "manual"`, and the page starts at the Hero. A URL hash (`#projects`) is honoured once the timeline exists.

### 10. In-view effects: park hidden stations off-screen
In journey mode every fixed panel overlaps the viewport, so IntersectionObserver-based effects (Framer `whileInView` reveals, `AnimatedCounter`, the Skills marquee) would all fire at load. Instead of adding a `useStationActive()` context to each of them, the driver **parks** every station that is before its arrival or after its departure at `translate3d(0, -300vh, 0)`. IntersectionObserver takes transforms into account, so those effects only see a station once it starts arriving: counters count on arrival, reveals play on arrival, and the marquee runs only while Skills is arriving, held or leaving. The existing components stay unchanged, and the stations stay in the accessibility tree.
- *Alternative, a `useStationActive()` context in each component:* rejected. It touches three components for the same result, and it would still leave `whileInView` firing at load.

### 11. Removed and unchanged
`ScrimDriver` and the `#scene-scrim` element are removed, and the vignette stays. Panels use the existing translucent surface tokens (`bg-surface/…`, border), with no backdrop blur. The Hero keeps no panel background. `FrameDriver` is unchanged: always in the hero range, and elsewhere while scrolling plus `SETTLE_MS`.

### 12. Feedback round: constant motion, central companion, layered content
- **Short holds, a camera that never stops:** the hold drops to 0.35 vh (plus overflow). `routeU` is a piecewise-linear map through two knots per station: station i's hold covers `i ± 0.1` (0.2 route units, slow), and the flight between holds covers the remaining 0.8 (about 2.5× faster). The camera slows at stations but moves with every scroll pixel, `pxForU` inverts the same knots, and the held panel drifts to 102.5% scale. The whole journey is about 40% shorter (desktop 9971 → 6011 px).
- **Central companion:** hero pose unchanged (beside the hero text). After that the companion blends between a `transit` pose (centre, about 7 units ahead, larger) and a `hold` pose (centre, 13 units ahead, behind the panel) by the distance of `u` from the nearest station. The destination pose stays centred above the Contact card.
- **Depth layers:** content blocks carry `data-depth` (heading 1–1.6, text 2–3, cards, timeline items and list rows staggered up to about 5). Arriving: each layer starts after `0.1·depth` of the arrival and rises from `70·depth` px. Held: a ±`6·depth` px parallax drift. Leaving: they fly up faster with depth. The transforms go on wrapper elements (e.g. a `div` around each project card), never on Framer motion elements or on the card itself, so hover transforms stay free.
- **Station variables:** the driver writes `--sp` (−1 → 1 across the station) and `--fill` (0 → 1 over the arrival) on each station body. CSS uses `--sp` for the headline chrome shimmer (a moving 300% gradient) and `--fill` for the About timeline line and its milestone dots (`--at` per dot). All of this applies in journey mode only.
- **Project cards:** `.card-tilt` (all modes, hover-capable pointers only): pointer-driven `--rx`/`--ry` tilt (none with reduced motion), a radial sheen at `--mx`/`--my`, and a border and shadow glow in the language color `--glow`. The pointer handlers write CSS variables, so nothing re-renders.

### 13. Second feedback round: logo only at the start, a planet per station, no boxes
- **Companion:** only the hero pose remains. `away = smoothstep(u, 0.04, 0.8)` flies it to `(5, 3, -48)` in camera space (x and y eased quadratically, so it first recedes and then veers off), shrinking by 40%, spinning one full turn, and fading its (now transparent) material over the last quarter. The group is hidden at the end. Because it is a function of `u`, scrolling up flies it back in. The transit/hold/destination poses from decision 12 are removed.
- **Planets:** `src/lib/stationPlanets.ts` is shared by the DOM and the scene. `planetSide(i, name)` returns none for the hero, `center` for Contact, and otherwise alternates `right`/`left`. `planetKind(name)` returns lava (stats), ocean (About), gas/desert/teal/lava/ocean/moon cycling for projects, moon (repositories), ice with ring (Skills) and violet (Contact). The store writes `data-planet` on each station, and `Planets` places one per station at `(side·16, 1, 30)` in the waypoint frame (tablet `side·13`, mobile above at `(side·3.5, 7.5, 30)`). The destination rises higher (`y 19`), so it no longer sits behind the Contact heading. Fade-in is now 70 → 50 units, so only the current station's planet shows at a hold and the next one appears during the flight. There is a new lava shader type (4), and teal/desert/moon are palettes of existing types.
- **No boxes:** the panel surface is removed. On ≥1024 px the content column is `min(56%, 46rem)` on the side opposite the planet, and the sections' multi-column grids become one column there. Readability comes from an edgeless radial shadow behind each station's content plus a text shadow. In journey mode `.card` becomes a hologram: a `--glow`-tinted gradient, a coloured edge and an outer glow.
- **Stats station:** `StatsStation` (journey only) renders the four hero facts (`useStatFacts`, shared with the hero) as large chrome numbers with a glow and an accent line that draws with `--fill`. The hero drops its stats row in journey mode, and the stacked page keeps it. It adds three dictionary keys (`hero.statsLabel`, `statsTitle`, `statsTitleHighlight`).
- **Projects:** one card per station on every width (six project stations). The `(min-width: 768px)` grouping query is removed.

### 14. Third feedback round: galaxies, readable skills, dark only
- **Galaxies instead of planets:** each station after the hero gets a `Galaxy`: `THREE.Points` in unit space, scaled per layout (radius 17 desktop, 14 tablet, 10 mobile), with 11000/8000/4000 stars. The stars split into a spiral-arm population (with a scatter that grows towards the core), a 30% exponential disc body, a haze of large faint points along the arms, and faint core stars, so the core keeps its colour under additive blending. A barred spiral gets a central bar. An elliptical galaxy is a flattened ball. The vertex shader rotates each star by `uTime / (0.25 + r)` (differential rotation) and fades stars within 5 units of the camera. A canvas-generated glow sprite marks the core. Discs are tilted about 30° from face-on towards the viewer. `stationGalaxies.ts` (side and kind) replaces `stationPlanets.ts`, and `[data-galaxy]` replaces `[data-planet]`.
- **Skills:** in journey mode `SkillsSection` renders the groups as a two-column grid of glowing chips instead of marquees. The stacked page keeps the marquees, and with them its constant-speed and accessibility requirements.
- **Dark only:** the light mode was pale and weak against the space scene. `ThemeToggle`, `theme.ts`, `themeScript.ts`, the `[data-theme="light"]` tokens, the circular theme reveal and the light palettes (`SCENE`, `SPACE`, normal-blending branches) are removed. The viewport `themeColor` is a single dark value.

## Risks / Trade-offs

- [Long timeline and many fixed layers on mid-range phones] → Only the ±1 neighbours get `will-change` and non-zero opacity. There is no backdrop blur, the star count is lower on mobile, and the sky is baked once.
- [Browser find-in-page lands on text in a hidden station] → Accepted. Focus-based navigation (Tab, links) is handled, and find highlights still work once the user scrolls there.
- [Scroll position is lost on reload] → The page deliberately restarts at the Hero, with hash deep links supported. This is documented and acceptable for a portfolio.
- [Timeline rebuild during a language switch shifts the position] → Keeping `u` across rebuilds holds the same station and phase, and only the pixel offset changes.
- [Tall content (long project cards on landscape phones) needs a long hold] → The hold grows with the overflow, so reading is never cut off.
- [Per-pixel nebula cost] → Nebula textures are pre-generated, and the sky is baked. The only per-frame shaders are stars, sprites and 4 planets.
- [The central companion shows through the translucent panels behind text] → At holds it sits far back (13 units, about 20% of the view height), so the panel surface keeps the text readable. It is only prominent during the flights, while the text is faded out.
- [Planets or clouds end up behind text on some sizes] → Placement is tuned per layout with screenshot passes at the five reference sizes, in both modes.
- [Framer `whileInView` / hover transforms conflict with driver transforms] → The driver writes to the `Station` wrapper only, never to the section's own elements.

## Migration Plan

This is frontend-only on the static export. Deploy with the existing Pages workflow. Roll back by reverting the change's commits. There is no data migration.

## Open Questions

- The exact constants (vh per phase, route spacing, planet offsets, star counts, palettes) are tuned by eye from screenshots and on a real device. They don't change the specs or the task breakdown.
