## 1. Stable journey on mobile browsers

- [x] 1.1 Measure the timeline height from a hidden `100svh` probe in `journeyStore.build()` (fallback `innerHeight`), and use it everywhere the journey uses `vh`
- [x] 1.2 In `JourneyProvider`, rebuild on `resize` only when `innerWidth` or the probe height changed. Verify with an emulated phone that a height-only resize neither rebuilds nor scrolls, and that rotating keeps the held station
- [x] 1.3 Confirm that Lenis leaves touch scrolling native (no `syncTouch`), and that touch scrolling updates the journey

## 2. Fade edges

- [x] 2.1 Add `--nav-clear` (safe-area inset + navbar height) and a top/bottom `mask-image` fade on `[data-journey] .station` in `globals.css`
- [x] 2.2 Verify in portrait and landscape screenshots that tall content fades under the navbar with no text behind or above it, and that short held stations are not faded

## 3. Compact short screens

- [x] 3.1 Add `@media (max-height: 500px)` rules for station padding in `globals.css`
- [x] 3.2 Give `HeroSection` short-screen padding and heading size. Verify at 750×342 that the hero fits, and at 1440×900 that the desktop hero and the stacked fallback are unchanged

## 4. Galaxies on narrow screens

- [x] 4.1 Dim each galaxy by its distance from its station's route position when the canvas is narrower than 1024px. Verify in screenshots that held text over a galaxy is readable and that galaxies brighten between stations

## 5. Rendering on touch devices

- [x] 5.1 Make `FrameDriver` render continuously at the hero only with a fine pointer, and wake on `touchstart`. Verify that an emulated phone at the hero renders 0 draws when idle, and that desktop still animates the hero
- [x] 5.2 Cap the Canvas DPR at 1.25 below 768px width

## 6. Touch targets

- [x] 6.1 Enlarge the navbar controls to at least 44×44px under `(pointer: coarse)`. Verify the sizes and that the navbar has no overflow at 320px and 390px

## 7. Checks

- [x] 7.1 Run `tsc --noEmit`, `npm run lint`, `npm run build`, and the behaviour checks (navbar, Tab, hash, idle 0 draws on desktop)
- [x] 7.2 Take screenshots along the route at 390×844, 750×342, 1024×768 and 1440×900
- [ ] 7.3 Owner check on a real phone (dev server on the LAN): swipe momentum with the address bar, rotation, readability
