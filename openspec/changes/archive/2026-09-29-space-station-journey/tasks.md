## 1. Journey mode foundations

- [x] 1.1 Move `prefersStaticBackground()` and the WebGL probe into `src/lib/sceneSupport.ts` and use it from `Background.tsx`/`CanvasContainer.tsx`. Verify that reduced motion and no-WebGL still show the static gradient, with no three.js chunk in the production build
- [x] 1.2 Add `JourneyProvider` (context `enabled`, sets `data-journey` on `<html>` when 3D will be shown) inside `SmoothScrollProvider`. Verify that SSR HTML has no `data-journey`, that it is set after mount on a capable browser and not under reduced motion

## 2. Timeline and stations

- [x] 2.1 Build `journeyStore`: station measuring in DOM order, the arrive/hold/leave timeline with overlap (no Hero arrive, no Contact leave), `phaseAt`, `routeU`, `holdPx`, `activeIndex`, rebuilt by `ResizeObserver` while preserving `u`. Verify with a scratch script or console checks that `routeU` is monotonic and integer during holds
- [x] 2.2 Add the `Station` component and `[data-journey]` CSS (fixed full-viewport layer, centred content, translucent panel surface without blur, Hero without panel) plus the scroll spacer in `page.tsx`. Wrap Hero, About, Skills and Contact. Verify that the stacked layout is pixel-identical with the journey off
- [x] 2.3 Implement the rAF driver: arrive/hold/leave transforms and opacity, tall-content translate during hold, `pointer-events` only on the held station, `will-change` only on the ±1 neighbours, and no work while the scroll is unchanged. Verify in screenshots at each phase that there are no re-renders (React Profiler) and that clicks go only to the held station
- [x] 2.4 Render `ProjectsSection` as station groups in journey mode (header plus first group, 2 cards per station ≥768px, 1 below, then the repo list as its own station), keeping the grid in stacked mode. Verify the order and grouping at 390px and 1440px, and that there is no hydration warning

## 3. Navigation, focus and in-view effects

- [x] 3.1 Make `useScrollTo` target `holdPx` of the section's first station in journey mode, with a distance-scaled duration. Verify that the navbar links and both hero buttons land in the hold state of the correct station
- [x] 3.2 Drive the Navbar active item from the journey store's `activesection` events in journey mode (IntersectionObserver kept for stacked mode). Verify that the pill follows the held station and is empty at the Hero
- [x] 3.3 Add the `focusin` handler (scroll to a non-held station), `scrollRestoration = "manual"` and hash deep links. Verify that tabbing from About into Projects flies there with the focused link visible, and that `/de/#skills` opens at Skills
- [x] 3.4 Park stations that are not arriving, held or leaving off-screen (design decision 10, replacing the planned `useStationActive()`), so `AnimatedCounter`, the Skills marquee and the reveals only start on arrival. Verified: the Contact follower count counts 0→11 on arrival, and the marquee stands still while Skills is parked

## 4. Route, camera and companion

- [x] 4.1 Add `buildRoute(stationCount)` (seeded Catmull-Rom through spaced waypoints) and move `FlightDriver` to position the camera at `routeU` with look-ahead and a small roll. Remove `ScrimDriver` and `#scene-scrim`. Verify that the camera turns gently, is still at holds, and matches after scrolling back
- [x] 4.2 Switch `GithubCompanion` to camera-space offsets (a right-side station pose per layout, the centre at the destination), with world-space trail, camera-relative face-on orientation and bank. Drop the keyframe tables from `sceneLayout.ts`. Verify that it stays right-side and face-on through turns and ends centred at Contact

## 5. Space world

- [x] 5.1 Add a `SPACE[theme]` palette and the sky shader baked once per mode into a cube render target as `scene.background`. Verify that the sky turns with the view, that it re-bakes on theme switch, and that no per-frame cost shows in draw-call counts
- [x] 5.2 Replace `ParticleField` with the 3D-wrapped starfield (colour attribute, twinkle from `sceneTime`, distance fades, 8000/3000 counts). Verify that the density at Contact matches the start, that there is no empty region when turning, and no popping
- [x] 5.3 Generate the nebula canvas textures and place the route-side sprites with a near-camera fade. Verify that the clouds pass by at depth, that no flat quad cuts the view, and that the network panel shows no image requests
- [x] 5.4 Add the four procedural planets (ocean world, gas giant, ringed ice planet, violet destination) with fresnel rims, placed beside their section's first station. Verify at 390×844, 768×1024, 1024×768, 1440×900 and 2560×1440 in both modes that each planet is in view at its station and not behind the panel's text

## 6. Integration checks

- [x] 6.1 Run screenshot passes through every station at the five reference sizes in dark and light mode. Check panel readability (contrast on the translucent surfaces), transitions, companion and planets
- [x] 6.2 Measure rendering: 0 draws while idle mid-page, full rate while scrolling. Check stacked-mode parity under reduced motion, no WebGL and no JS
- [x] 6.3 Run `tsc --noEmit`, `npm run lint` and `npm run build` (static export). All must pass

## 7. Feedback round: constant motion, central companion, layered content effects

- [x] 7.1 Shorten the holds (0.35 vh plus overflow) and make `routeU` piecewise-linear from knots, so the camera slows at stations but never stops, with a slow panel drift while held. Verify that `routeU` is strictly increasing with scroll and that consecutive 100px scroll steps always change the camera and the panel
- [x] 7.2 Move the companion's cruise pose to the centre (in front and larger between stations, back behind the panel while held) for all layouts. Verify in screenshots that it is centred at holds and transitions on desktop, tablet and phone
- [x] 7.3 Add depth layers (`data-depth`) to the section content and animate them per station phase in the driver (staggered arrival, parallax in hold and leave). Verify in screenshots mid-arrival that the layers arrive one after another and are fully shown in the hold
- [x] 7.4 Drive a `--sp` station-progress variable for the headline chrome shimmer and a `--fill` variable for the About timeline line and milestones (journey mode only). Verify in screenshots that the line draws on arrival and that the stacked page is unchanged
- [x] 7.5 Add the pointer tilt, sheen and language-colour glow to project cards (hover-capable devices, no tilt with reduced motion). Verify with a hover in the browser, and check that touch emulation shows no tilt
- [x] 7.6 Re-run the integration checks from group 6 (screenshots at 5 sizes in both modes, navigation/focus/hash checks, idle 0 draws, stacked parity, tsc/lint/build)

## 8. Second feedback round: logo only at the start, a planet per station, content without boxes

- [x] 8.1 Make the companion hero-only: it flies off (recede, veer up and right, spin, fade) as a function of `u` and flies back in on scroll-up. Verified with screenshots at 0, 150, 400 and 1900 px, and after scrolling back to the top
- [x] 8.2 Add `stationPlanets.ts` (side and kind per station), `data-planet` on stations, one planet per station with alternating sides, the lava shader and new palettes, a higher destination, and a tighter fade-in. Verified in screenshots at 1440, 1024 (light) and 390 that each station shows its own planet opposite the content
- [x] 8.3 Remove the dark panels: side column on ≥1024 px, one-column grids there, edgeless shadow and text shadow, hologram cards. Verified that text stays readable over stars and planets in both modes
- [x] 8.4 Add `StatsStation` with glowing numbers (the hero hides its stats in journey mode) and one project per station. Verified that there is no wrapping or clipping of the numbers at 390 and 1440, and that the stacked page still shows the stats in the hero
- [x] 8.5 Re-run the integration checks: behaviour checks (navbar, Tab, hash, counter, marquee, idle 0 draws) pass, the stacked parity only differs by the running animations, and tsc/lint/build pass with no three.js under reduced motion

## 9. Third feedback round: galaxies, readable skills, dark only, new project

- [x] 9.1 Replace the planets with particle galaxies (`Galaxies.tsx`, `stationGalaxies.ts`): spiral, barred and elliptical, a disc body, arm haze, a tinted core glow, differential rotation, fading in on approach. Verified in screenshots that each station shows its own coloured galaxy
- [x] 9.2 Show the skills in the journey as static chip groups (the stacked page keeps the marquee). Verified that all skills are readable at the Skills station
- [x] 9.3 Remove the light mode: the theme toggle, the init script, `theme.ts`, the light tokens, the view-transition reveal and the light scene palettes. Verified that a light OS preference still renders dark and that tsc/lint/build pass
- [x] 9.4 Replace FruitAuth with the 3D Vector Viewer (`3d-vector-graphic`, C#/.NET 10/Raylib-cs), with EN/DE copy verified against its README and sources. Verified that the card renders at its station
