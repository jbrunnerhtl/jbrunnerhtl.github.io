## Why

The flight added in `scroll-flight-through-space` is too subtle: fine dust drifting behind an ordinary scrolling page still reads as "the same website". The owner wants to fly through outer space, with the GitHub logo as a companion, and the portfolio built around that journey: each part of the portfolio is a station in space that you fly to, arrive at, read, and fly past.

## What Changes

- **Station journey (new):** Scrolling becomes a journey along a route through space. Each part of the portfolio is a station: Hero (start), About, Projects (several stations, one per group of project cards, then the repository list), Skills, and Contact (destination). At each station its content arrives from the depth, holds while it is read, and then flies past the viewer as the journey continues. Content taller than the viewport scrolls within its station while it holds.
- **Space world (new):** The 3D background becomes outer space: a dense, coloured, twinkling starfield in all directions, a distant sky with a nebula, nebula clouds you pass through, and a procedurally drawn planet at each station (for example an atmosphere world at About, a banded gas giant at Projects, a ringed planet at Skills). No downloaded textures or models.
- **Flight route:** The camera follows a curved route with gentle turns instead of a straight line. It slows down while you are at a station and glides faster between stations. It is still a pure function of the scroll position.
- The **GitHub logo companion** stays and flies alongside through the whole journey. It flies in the centre of the view (in front between stations, further back behind the content at stations) and ends centred at Contact.
- **Navigation:** The navbar and in-page buttons fly to the station where the section's content is fully shown. The active navbar item follows the current station. Keyboard focus moving into another station flies there.
- **Content panels:** The sections are shown as translucent panels over the world (no backdrop blur). The scrim that dimmed the whole scene is removed.
- **BREAKING (layout):** In journey mode, featured project cards are shown in groups per station (two per station on wide screens, one on narrow screens) instead of one grid.
- **Feedback round (after first review):** Shorter holds, and the camera never stops while scrolling, so the scene changes with every scroll step. The companion flies in the centre of the view. The content arrives in depth layers with parallax, highlighted headline words shimmer, the About timeline draws itself, and project cards tilt with a sheen and a glow in their language color on hover.
- **Second feedback round:** The GitHub logo stays only at the start: it flies off into the depth as the journey begins and flies back in when scrolling up. Every station gets its own planet (one per project too), and the content floats beside it without dark panels: project cards as coloured holograms, and the GitHub stats as a station of their own with large glowing numbers.
- **Third feedback round:** Galaxies (made of glowing star particles, one per station) replace the planets. In the journey the skills are static, readable chips. The site becomes dark-only (the light mode and the color mode toggle are removed). The new 3D Vector Viewer repository replaces FruitAuth among the featured projects.
- **Fallback:** With reduced motion, data saving, a low-end device, no WebGL or no JavaScript, the page stays the current stacked layout with the static gradient. Nothing about the journey applies there.

## Capabilities

### New Capabilities
- `station-journey`: the scroll-driven station layout of the page content: which stations exist, how their content arrives, holds and leaves, tall content, navigation and focus between stations, and the fallback to the stacked page.

### Modified Capabilities
- `canvas-3d-experience`: "Scroll-Driven Flight Through Space" becomes a curved, station-paced route with no scrim. "Endless Particle Corridor" becomes an all-around starfield. "GitHub Logo Companion" keeps its behaviour and follows the rotating camera. A new requirement adds the space world (sky, nebulae, planets).
- `project-showcase`: "Project Cards" are shown in station groups in journey mode, and in a grid in the stacked fallback.

## Impact

- `src/app/[lang]/page.tsx` and all section components: wrapped in station stages. The stacked markup stays the source and the fallback.
- New: a journey driver on the client (station measuring, per-frame panel transforms, route progress written to `motionStore`), and a journey-mode flag on `<html>`.
- `src/components/3d/*`: new route/camera driver, starfield (replaces `ParticleField`), sky dome, nebula sprites, procedural planets. `sceneLayout.ts` poses are simplified to camera-space offsets. `ScrimDriver` is removed.
- `Navbar.tsx` and `SmoothScrollProvider.tsx`: scroll targets and active section come from station positions in journey mode.
- `ProjectsSection.tsx`: cards are rendered in station groups in journey mode.
- No new dependency. The static export, i18n and GitHub stats are unchanged.
