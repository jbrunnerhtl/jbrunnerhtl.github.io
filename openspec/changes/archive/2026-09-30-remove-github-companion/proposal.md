## Why

The owner wants the GitHub logo gone from the space scene entirely. The journey (galaxies, stars, station content) carries the page on its own, and GitHub links remain in the navigation, hero and project cards.

## What Changes

- **BREAKING (visual):** Remove the 3D GitHub logo companion from the hero and from the scroll flight.
- Remove the chrome-only studio lighting (the procedural environment map) that only existed to light the logo.
- The GitHub mark SVG path goes back into the GitHub icon component, since nothing else uses it.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `canvas-3d-experience`: "GitHub Logo Companion" is removed, and "Scroll-Driven Flight Through Space" no longer mentions a companion.

## Impact

- Delete `src/components/3d/GithubCompanion.tsx` and `src/components/icons/githubMark.ts`.
- `src/components/3d/CanvasContainer.tsx`: drop the companion, the `Environment`/`Lightformer` setup and its palette.
- `src/lib/motionStore.ts`: drop `routeU`, which only the companion read.
- No new dependency. The DOM, content and fallback are unchanged.
