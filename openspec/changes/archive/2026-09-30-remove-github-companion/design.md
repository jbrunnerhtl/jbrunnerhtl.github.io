## Context

The companion (`GithubCompanion.tsx`) is the only object in the scene that uses a physical, reflective material. The drei `Environment` with `Lightformer` strips in `CanvasContainer` exists only to give it chrome reflections. `motionStore.routeU` is written by `FlightDriver` and read only by the companion. The SVG path in `githubMark.ts` was split out so the icon and the 3D geometry could share it.

## Goals / Non-Goals

**Goals:** remove the companion and everything that only exists for it, with no visual change elsewhere.

**Non-Goals:** no changes to the route, galaxies, stars, stations or DOM content.

## Decisions

- **Remove the environment map with the companion.** Nothing else samples `scene.environment` (the stars, nebulae and galaxies are unlit shaders or sprites, and the sky is `scene.background`). Removing it also saves the one-off environment bake.
- **Inline the GitHub mark path back into `GithubIcon.tsx`.** A shared constant with one consumer is indirection without benefit.
- **Drop `motionStore.routeU`.** `FlightDriver` computes `u` locally, and every other consumer already calls `journeyStore.routeU(px)`.

## Risks / Trade-offs

- [The hero feels emptier on the right side] → Accepted by the owner. The galaxies and stars remain behind the hero text.
