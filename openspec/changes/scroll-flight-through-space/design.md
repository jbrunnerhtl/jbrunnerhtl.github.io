## Context

The background is one fixed R3F `<Canvas>` (`frameloop="demand"`) with a camera fixed at `z = 5.5`. `LiquidChromeMesh` moves the orb between per-layout keyframe poses sampled from `motionStore.scrollProgress`, and it is also the component that advances `motionStore.sceneTime`, the pausable scene clock. `ParticleField` is a finite 18 × 14 × 8 cloud of 400 points that drifts in y with scroll. `ScrimDriver` dims the scene to about 0.62 opacity over the first 700px. `FrameDriver` invalidates every frame in the hero and every other frame elsewhere while input is active. All scroll and pointer state comes from `motionStore`, which Lenis writes without React re-renders. The DOM content is unaffected by any of this.

See proposal.md for motivation and specs/canvas-3d-experience/spec.md for the required behavior.

## Goals / Non-Goals

**Goals:**
- Flight is a pure function of scroll position, and the companion's trailing is the only stateful motion on top of it.
- Keep the zero-cost idle behavior and the existing loading/fallback pipeline untouched.
- Keep one scene clock (`sceneTime`) and one place that writes the camera.

**Non-Goals:**
- No DOM-side changes (no 3D transforms on sections, no pinning).
- No new dependency, no downloaded models or textures.
- No interactivity on the companion (no raycasting, no link).
- No speed streaks, FOV kick or other "hyperspace" effects.

## Decisions

### 1. Camera depth derives from scroll pixels, not progress
`camZ = CAMERA_START_Z - scrollPx * UNITS_PER_PX` (0.006 units/px, tuned by eye: ~5 units per viewport of scrolling reads as calm gliding), written directly to `camera.position.z` in a `FlightDriver` inside the Canvas. Lenis already smooths `scrollPx`, so there is no extra damping on the camera. That keeps the mapping deterministic, and navbar jumps glide at Lenis' pace.
- *Why pixels over `scrollProgress`:* the speed per scrolled pixel stays the same on every layout and page length. With progress, a long mobile page would fly slower per swipe than a short desktop page. The corridor is endless, so the total distance does not matter.
- *Alternative, velocity-driven endless drift:* rejected. It is not deterministic (the same position shows a different scene), and it would need continuous rendering while idle, which breaks the On-Demand Rendering requirement.

### 2. Companion placed relative to the camera, trailing via world-space damping
The per-layout keyframe tables (`DESKTOP`/`TABLET`/`MOBILE`, sampled by `scrollProgress` with smoothstep) now describe an **offset from the camera** (`target = camera.position + (pose.x, pose.y, pose.z - 5.5)`). The companion's world position is damped towards that target (`damp`, λ≈4). Because the target moves with the camera, the damping produces a lag proportional to flight speed with no extra state. The z lag is clamped to about 0.8 units, so a fast navbar jump cannot pull the logo into the lens. Banking is `rotation.z`, damped towards `-clamp(scrollVelocity * k, ±0.14 rad)` (≈8°).
- *Alternative, parenting the companion to the camera:* simpler, but then it can't trail, and it would feel glued on.
- `sceneLayout()` and the pose tables move out of `LiquidChromeMesh.tsx` into `sceneLayout.ts`, because `ScrimDriver` imports `sceneLayout`.
- **Choreography: right edge, then home at Contact.** Past the hero the sections (cards, repo list, marquee) span nearly the full width, so no poses sit beside the text. The companion drops back (z ≈ -3) and glides along the **right** edge, half off-screen, until 85% progress, then returns to the centre behind the Contact card as the end of the flight. Poses that alternated sides were tried first and rejected: every side switch dragged the logo through a headline. The side offset scales with aspect ratio on desktop (as before) and now on the mobile layout too, so portrait tablets (768×1024) push it to the edge like phones.

### 3. Logo geometry from the shared SVG path
The `d` string moves from `GithubIcon.tsx` into a shared constant (for example `src/components/icons/githubMark.ts`) that both files use. The 3D mesh uses `SVGLoader` (bundled in `three/examples/jsm`): parse the path, run `SVGLoader.createShapes` (it keeps the Octocat cut-out as a hole), then `ExtrudeGeometry` with a small depth and a soft bevel, then `center()`, then flip Y (SVG y points down) and scale to roughly the orb's former footprint. The geometry is built once in `useMemo`, with lower `curveSegments` on mobile.

### 4. Plain physical chrome material, no distortion
`MeshPhysicalMaterial` keeps the orb's values (metalness 1, roughness 0.2, iridescence, envMapIntensity 1.1). `MeshDistortMaterial` is dropped: it displaces vertices along normals, which tears a sparse extruded mesh instead of looking liquid. The velocity-to-distortion coupling goes with it.

### 5. Orientation stays face-on
`rotation.y = clamp(sin(t·0.35)·0.25 + pointerX·0.3, ±0.5 rad)` and `rotation.x = -pointerY·0.25`, both damped. The free spin `t·0.12` is removed because a flat mark turned beyond about 60° reads as a sliver.

### 6. Scene clock moves to the flight driver
With the orb gone, `FlightDriver` advances `motionStore.sceneTime` (clamped delta, only on rendered frames) and sets the camera before the companion and particles read them. It is registered first, and R3F runs `useFrame` callbacks in mount order within the same priority.

### 7. Particle corridor wraps in the vertex shader
`ParticleField` becomes `THREE.Points` with a small `ShaderMaterial` (`frustumCulled = false`, since positions are shifted on the GPU):
- Attributes: base `(x, y)` drawn from an annulus (`rMin` about 0.9 keeps the centre clear, up to about 9), a base depth `aZ ∈ [0, L)` and a per-point size. `seededRandom` stays, so the layout is deterministic.
- Uniforms: `uCamZ`, `uLength`, `uScale` (half the drawing-buffer height, matching three's size attenuation), `uColor`, `uOpacity`. The uniforms are written through the material ref, because the React Compiler lint forbids mutating memoized values.
- Vertex: `d = mod(aZ + uCamZ, L)` is the distance ahead of the camera, so moving forward shrinks it. `worldZ = uCamZ - uNear - d`. Alpha is `smoothstep(0, fadeNear, d) * (1 - smoothstep(L - fadeFar, L, d))`, so the wrap jump happens while the particle is invisible. The point size is attenuated by view depth.
- Fragment: a soft round sprite from `gl_PointCoord`, multiplied by the varying alpha.
- Depth layers come from the size distribution (many fine dust points, a few larger soft ones). Perspective produces the parallax.
- Counts: 1200 on desktop and tablet, 450 on mobile (the annulus spreads points wider than the old box, so more are needed for similar visible density; still negligible GPU cost). Corridor length L = 36. The slow rotation becomes a roll around the flight axis (a y rotation about the origin would swing the far-away corridor), and the pointer lean stays. The old y-drift with scroll is removed, because the flight replaces it.
- *Alternative, recycling positions on the CPU each frame:* rejected. It writes a buffer every frame for no visual gain.

### 8. Scrim and frame rate
- `SCRIM` max values drop to desktop `[0.12, 0.35]`, tablet `[0.25, 0.4]`, mobile `[0.4, 0.5]`. Checked in screenshots in both modes: body text stays legible, so no section backdrops were needed.
- `FrameDriver` drops the `frame++ % 2` throttle: while input is active (plus `SETTLE_MS`), it invalidates every frame everywhere. `SETTLE_MS` (1600ms) already covers the companion's catch-up (λ≈4 settles in about 1s). Idle still renders nothing.

## Risks / Trade-offs

- [A crisp, high-contrast logo distracts more behind text than a soft orb] → Keep the per-layout poses beside the text column, re-check mobile (currently centred above the headline), and scale down slightly if needed.
- [Weaker scrim hurts readability past the hero] → Check contrast in both modes. If text over busy regions fails, add a subtle backdrop behind section text blocks as a follow-up task, rather than dimming the whole scene again.
- [Full frame rate while scrolling costs more on mid-range phones] → Fewer particles and lower `curveSegments` on mobile, DPR stays capped at 1.5, and the existing low-end and reduced-motion gates keep weak devices on the static gradient.
- [Visible popping at the corridor wrap] → The wrap only happens at `d ≈ 0` / `d ≈ L`, where alpha is 0 on both sides. Verify by scrolling slowly.
- [GitHub's logo guidelines discourage modifying or animating the mark] → The owner accepts this for a personal portfolio. The shape stays unaltered (only extruded), and the colour comes from the chrome material.
- [Extruded SVG triangulation artefacts (holes, bevel self-intersections)] → Keep the bevel small relative to the thinnest stroke (the Octocat's tail). Verify with lighting in both modes.

## Migration Plan

This is a frontend-only change on the static export. Deploy through the existing Pages workflow. To roll back, revert the change's commits. There is no data or config migration.

## Open Questions

- The tuning values (`UNITS_PER_PX`, particle counts, scrim max, trail λ, bank factor) were set from headless screenshots. A pass on a real device, especially the feel of the speed and the trail, may still adjust them. That doesn't affect the specs.
