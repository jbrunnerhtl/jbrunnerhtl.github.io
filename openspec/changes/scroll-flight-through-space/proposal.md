## Why

The 3D background currently stands still: the camera is fixed and only the orb shifts between keyframes, so scrolling feels like moving a page over a backdrop. The site should instead feel like a calm flight through space. Scrolling moves you forward through a star-like field, and a companion object flies alongside you the whole way down the page.

## What Changes

- The camera flies forward through space along its depth axis, driven by the smoothed scroll position across the whole page. Scrolling up flies back, and standing still means standing still.
- A new endless particle corridor replaces the current finite particle cloud. Particles are recycled around the camera so the space never runs out, fade in from the distance and out before the lens, keep the centre clear, and use several depth layers for parallax.
- Calm gliding style: no warp streaks and no field-of-view kick. Scroll speed only adds a subtle bank to the companion.
- **BREAKING (visual):** The liquid chrome orb is replaced by a companion, an extruded 3D GitHub logo built from the site's existing GitHub icon path, in the same chrome/iridescent look without the liquid distortion. It keeps facing the viewer (limited sway, pointer lean), stays beside the text column per layout, trails slightly when the flight starts and catches up when it stops. It is decoration only and remains non-interactive.
- The scrim that dims the scene after the hero is reduced so that the flight stays visible past the hero.
- Rendering past the hero runs at full frame rate while scrolling (instead of half rate), so the flight does not stutter. Idle still renders nothing.
- Reduced motion, data saving, low-end devices and missing WebGL keep the static gradient: no flight at all.

## Capabilities

### New Capabilities
<!-- none: the flight and corridor are part of the existing 3D background capability -->

### Modified Capabilities
- `canvas-3d-experience`: "Liquid Chrome Background Orb" becomes a GitHub-logo companion. "Scroll-Synchronized Orb Choreography" becomes scroll-driven camera flight with a companion that trails and banks and a reduced scrim. "On-Demand Rendering" renders at full rate while scrolling past the hero. A new requirement adds the endless particle corridor.

## Impact

- `src/components/3d/LiquidChromeMesh.tsx`: replaced by a GitHub-logo companion component. `sceneLayout` and the per-layout pose keyframes are kept and moved or re-exported.
- `src/components/3d/ParticleField.tsx`: rewritten as a camera-relative, wrapping particle corridor (custom shader on points).
- `src/components/3d/CanvasContainer.tsx`: adds a camera flight driver, lowers the scrim values, and makes `FrameDriver` render at full rate while scrolling.
- `src/components/icons/GithubIcon.tsx`: the SVG path moves to a shared constant used by both the icon and the 3D geometry.
- `src/lib/motionStore.ts`: may gain a derived flight value (camera depth). Written by the scene only.
- No new dependency: `SVGLoader` ships with `three` (`three/examples/jsm`). No DOM or content changes. Reduced-motion and fallback paths are unchanged.
