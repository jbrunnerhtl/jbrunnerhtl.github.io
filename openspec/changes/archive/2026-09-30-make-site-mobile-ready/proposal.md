## Why

The space journey runs on phones, but it was built and checked mainly on desktop. On an emulated iPhone, tall stations (About, long project cards, Skills, Contact) scroll up under the fixed navbar, and their text shows through and above it. Galaxies sit behind body text. In landscape (about 750×340) almost nothing fits: the hero text is cut off at the bottom and every station overflows. Mobile browsers also resize the viewport whenever the address bar shows or hides. The journey rebuilds its timeline on every resize and jumps the scroll position, which would cut off a swipe's momentum on a real phone. The owner wants the site to work properly on mobile.

## What Changes

- The journey keeps its timeline stable on mobile browsers: the address bar showing or hiding no longer rebuilds the timeline or moves the scroll position. Rotating the device or resizing the width still does, keeping the current place.
- Tall station content fades out under the navbar and at the bottom edge instead of running behind the navbar.
- Short screens (phones in landscape, small windows) get a compact station layout: less padding, a smaller hero, a slimmer navbar gap, so the hero and most stations fit or overflow only a little.
- On narrow layouts, galaxies dim while their station's text is held over them, and brighten again during the flight between stations.
- Touch targets in the navbar (language switch, menu button, GitHub link) are at least 44×44px on touch devices.
- On touch devices the 3D scene stops rendering after the settle period even while the hero is on screen, and the render resolution is capped lower on phones, to save battery and heat.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `station-journey`: "Tall Station Content" gains fade edges under the navbar and at the bottom. New requirements: "Stable Journey on Mobile Browsers" (address bar, rotation) and "Compact Stations on Short Screens".
- `canvas-3d-experience`: "On-Demand Rendering" pauses the hero on touch devices too, and a stale scenario about the removed companion is corrected. "Space World" dims galaxies behind held text on narrow layouts.
- `portfolio-ui`: "Responsive Navigation and Layout" raises touch targets to 44px on touch devices.

## Impact

- `src/lib/journeyStore.ts`, `src/components/journey/JourneyProvider.tsx`: stable viewport height, resize filtering.
- `src/app/globals.css`: fade mask on stations, compact short-screen rules.
- `src/components/sections/HeroSection.tsx`: short-screen sizing.
- `src/components/3d/CanvasContainer.tsx`, `src/components/3d/Galaxies.tsx`: touch render policy, DPR cap, galaxy dimming.
- `src/components/navigation/Navbar.tsx`, `src/components/ui/LanguageSwitch.tsx`: touch target sizes.
- No new dependencies. The stacked fallback stays pixel-identical on desktop. On phones it only gets the larger touch targets.
