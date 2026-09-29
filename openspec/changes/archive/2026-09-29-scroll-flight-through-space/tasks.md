## 1. Shared foundations

- [x] 1.1 Move the GitHub mark's SVG `d` string into a shared constant (e.g. `src/components/icons/githubMark.ts`) and use it in `GithubIcon.tsx`. Verify that the navbar/contact GitHub icons render unchanged
- [x] 1.2 Move `sceneLayout()`, `SceneLayout` and the per-layout pose tables out of `LiquidChromeMesh.tsx` into a standalone module and update the `ScrimDriver` import. Verify with `tsc --noEmit`

## 2. Camera flight

- [x] 2.1 Add a `FlightDriver` in `CanvasContainer.tsx`, mounted before the scene objects, that sets `camera.position.z` from `scrollPx` and advances `motionStore.sceneTime` (clamped delta, rendered frames only). Verify that scrolling down moves the camera forward, scrolling up moves it back, and the same position shows the same scene
- [x] 2.2 Remove the `frame++ % 2` throttle from `FrameDriver` so active input renders every frame past the hero. Verify in the Performance panel that scrolling mid-page renders at display rate and idle mid-page renders 0 frames after the settle period

## 3. GitHub logo companion

- [x] 3.1 Build the companion geometry with `SVGLoader.createShapes` and `ExtrudeGeometry` (small depth, soft bevel, centred, Y flipped, scaled to the orb's former footprint, lower `curveSegments` on mobile). Verify that the Octocat cut-out is a real hole and the lighting shows no triangulation artefacts in dark and light mode
- [x] 3.2 Apply `MeshPhysicalMaterial` with the orb's chrome/iridescence values (no distortion) and replace `LiquidChromeMesh` in the canvas. Delete the old component. Verify the chrome look and that the environment re-bakes on theme switch
- [x] 3.3 Place the companion at camera position plus pose offset, damped in world space (λ≈4) with clamped z lag, and bank it from `scrollVelocity` (at most about 8°). Verify that it trails and banks when scrolling starts and catches up and levels after stopping, and that a navbar jump to Contact never pulls it into the lens
- [x] 3.4 Replace the free spin with a bounded face-on sway plus pointer lean (yaw clamped to ±0.5 rad). Verify that the logo never turns edge-on while idle or when the pointer is at the screen corners
- [x] 3.5 Re-tune the pose tables so the logo stays beside the text column at 375×812, 768×1024, 1024×768, 1440×900 and 2560×1440. Verify that it never overlaps headline or body text

## 4. Particle corridor

- [x] 4.1 Rewrite `ParticleField` as `Points` with a wrapping `ShaderMaterial` (annulus base positions, `mod` depth wrap from `uCamZ`, near/far alpha fades, depth-attenuated soft round sprites, `frustumCulled = false`, seeded layout, theme colour uniform). Verify that the density at Contact matches the hero and that slow scrolling shows no popping at the wrap
- [x] 4.2 Add depth layers through the size distribution and set the counts (1200 desktop/tablet, 450 mobile). Keep the gentle rotation and pointer lean, and drop the scroll y-drift. Verify that nearer particles pass visibly faster and the view centre stays clear

## 5. Scrim

- [x] 5.1 Lower the `SCRIM` max values per layout. Verify that the flight stays clearly visible past the hero and that body text in About/Projects/Skills/Contact stays legible in both modes. If a section fails, add a subtle backdrop behind its text block and re-check (not needed)

## 6. Integration checks

- [x] 6.1 Scroll the whole page on desktop and in touch emulation (mobile layout). Check that the flight is calm and continuous with no streaks or FOV changes and no stutter, and that clicks where the logo is drawn reach the content underneath
- [x] 6.2 With reduced motion enabled, and with WebGL disabled, check that the static gradient shows, no three.js chunk loads, and there are no console errors
- [x] 6.3 Run `tsc --noEmit`, `npm run lint` and `npm run build` (static export). All must pass
