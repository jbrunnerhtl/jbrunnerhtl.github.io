## Context

Checks on an emulated iPhone 13 (390×844 portrait, 750×342 landscape) show the journey working without horizontal overflow or errors, but with these gaps:

- `journeyStore.build()` measures `vh = window.innerHeight`, and `JourneyProvider` rebuilds on every `resize` event, then calls `scrollToPx(pxForU(u))`. On iOS and Android, `innerHeight` changes whenever the toolbar collapses or expands during a scroll. That means a rebuild and a programmatic scroll mid-swipe, which cancels native momentum. Headless emulation does not reproduce this, so it was never seen.
- Stations are `position: fixed; inset: 0` layers. Tall content (overflow > 0) starts at `baseY = 0` and moves up by `overflow * p` during the hold, so it passes behind the translucent navbar pill and shows above it.
- `.station-body` reserves `5.5rem` at the top, and children add `2.5rem` above and below. The hero uses `min-h-[100svh] pt-28 pb-16` and `text-[clamp(2.75rem,11vw,7.5rem)]`, which is about 82px at 750px width, too tall for a 342px high screen.
- `Galaxies` places each galaxy in its waypoint frame per `sceneLayout` (mobile = aspect < 0.9). The CSS puts content beside the galaxy only from 1024px. Below that, content spans the width and galaxies sit behind the text, including phones in landscape, which count as "tablet" layout.
- `FrameDriver` renders every frame while `scrollPx < 0.9 × innerHeight`, even without input. The Canvas uses `dpr={[1, 1.5]}` everywhere.
- The navbar controls are 36×32 (language options) and 40×40 (menu button, logo link) on phones.

## Goals / Non-Goals

**Goals:** a stable, smooth journey on real phones in both orientations. No text visible behind the navbar. A hero that fits in landscape. Readable text over galaxies. Touch-friendly controls. Less battery drain.

**Non-Goals:** no redesign of the stations or their content. No separate mobile-only journey. No change to the desktop look. No change to the stacked fallback beyond the touch target sizes and the short-screen hero sizing (which only apply on phones). No new dependencies.

## Decisions

### 1. Stable viewport height for the timeline
- `build()` measures the height from a hidden probe element sized `height: 100svh` (the small viewport, which does not change with the toolbar), falling back to `innerHeight` where `svh` is unsupported. The small height (rather than `lvh`) is used so tall content scrolls fully into view even while the toolbar is expanded.
- `JourneyProvider` keeps the last `innerWidth` and probe height. On `resize` it rebuilds only if either one changed, which covers rotation and window resizes, and ignores toolbar-only height changes. The `ResizeObserver` on station bodies (content height) and the `MutationObserver` stay as they are.
- *Alternative:* debounce resizes. This was rejected because it still jumps once the swipe ends.
- *Alternative:* `visualViewport` events. These were rejected because they fire even more often and do not help.
- Touch scrolling stays native. Lenis already leaves touch alone by default (`syncTouch: false`), so this is verified rather than changed.

### 2. Fade edges instead of running behind the navbar
- `[data-journey] .station` gets a `mask-image` linear gradient: transparent down to the navbar bar's bottom edge (`--nav-clear`), fading in over 1.5rem, then fully opaque down to 1.5rem above the bottom, where it fades out. The bar's height differs by breakpoint and pointer type (66–84px), so `JourneyProvider` measures it on every rebuild (`offsetTop + offsetHeight`, which ignores the navbar's entrance slide) and sets `--nav-clear` on `<html>`. A CSS fallback (safe-area inset + 3.75rem) covers the first frame.
- The mask sits on the fixed station layer, not the moving body, so it stays in viewport coordinates while content scrolls through.
- Short, centred content begins below the fade zone (the top padding is larger than `--nav-clear` + fade), so held short stations are not faded. This will be verified in screenshots.
- *Alternative:* an opaque bar behind the navbar. This was rejected because it would cut the space scene with a hard edge.

### 3. Compact layout on short screens
- `@media (max-height: 500px)`: `.station-body` top padding becomes `--nav-clear` + 1rem, and the children's vertical padding drops from 2.5rem to 1rem. Tailwind gets `short` and `coarse` custom variants (`@custom-variant`) for the component classes.
- The hero uses `pt-[6.5rem] pb-4` (clearing the navbar's fade zone), smaller gaps, a two-line `text-sm` tagline and a heading of `clamp(2.25rem, min(11vw, 17svh), 7.5rem)` on short screens, so name, line, text and buttons fit in about 340px. This uses Tailwind arbitrary media variants on `HeroSection`. Because it applies in both modes, the stacked page on a phone in landscape benefits too. Desktop screens are never below 500px high in practice, so the desktop fallback stays unchanged.

### 4. Dim galaxies behind text on narrow screens
- "Narrow" means a canvas width below 1024px, the same breakpoint at which the CSS puts content beside the galaxy. The aspect-based `sceneLayout` is not used here, because it treats landscape phones as "tablet".
- In `Galaxy`'s frame, if narrow, the opacity is multiplied by `1 − 0.55 × (1 − smoothstep(0.25, 0.6, |u − i|))`. Here `u = journeyStore.routeU(scrollPx)` and `i` is the galaxy's station index. The galaxy is at 45% while its station is held and back to full brightness halfway through the flight. This is a pure function of scroll, like everything else.
- *Alternative:* moving galaxies out of the text area on phones. This was rejected because there is no free area when the text fills the screen, and dimming keeps the galaxy visible between stations.

### 5. Render policy and resolution on touch devices
- `FrameDriver` renders continuously at the hero only when `matchMedia("(pointer: fine)")` matches. On touch-only devices the hero follows the same input-plus-settle rule as the rest of the page. Touch input already moves `scrollPx`. A `touchstart` listener also wakes the loop.
- The Canvas uses `dpr={[1, 1.25]}` when the viewport is narrower than 768px (phones), and keeps `[1, 1.5]` elsewhere. The 3D scene is points and sprites behind DOM text, so the lower density is not visible, while fill cost drops by about 30%.

### 6. Touch targets
- These use a `(pointer: coarse)` arbitrary variant, so desktop sizes stay unchanged. Language options become `h-11 min-w-11`, the menu button and GitHub link `h-11 w-11`, the logo link `min-h-11 min-w-11`, and the section links on touch tablets `py-3`. On a 320px screen the row needs roughly 131 + 92 + 44 + padding ≈ 290px of the available 296px. This will be verified at 320px.

## Risks / Trade-offs

- [`mask-image` on a full-screen fixed layer costs compositing on weak phones] → At most two stations are unparked at a time. If it shows up in profiling, apply the mask only to stations with `overflow > 0` (via a `data-tall` attribute set in `build()`).
- [`svh` is unsupported in old browsers] → Falls back to `innerHeight` plus the width/height-change check, which is the current behaviour.
- [The real address bar behaviour and touch momentum can't be tested headless] → The final task is a check on the owner's phone via the dev server on the LAN.
- [With the stable small height, centred content sits a little higher than centre while the toolbar is collapsed] → The difference is the toolbar height (about 50–80px). This is accepted in exchange for no jumps.
