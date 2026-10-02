# Proposal

## Why

The site's accent is a bright cyan (`#2de2f0`). The owner wants a dark, magenta-leaning violet instead. Unlike cyan, a dark violet cannot serve as fill and as text in both modes, so the accent needs two tones in dark mode and the label on accent buttons has to turn white.

## What Changes

- The accent fill becomes dark magenta-violet `#a21caf` in both modes, with a white label on it.
- Accent-colored text (numbers, links, active navigation, focus ring) uses a lighter magenta `#e879f9` in dark mode and `#a21caf` in light mode.
- Decorative accent lines (section divider, navigation hover line, the markers in Skills and on the project page) use the readable tone, so they stay visible on the dark background.
- The hero sphere's light and its base tint move from cyan-tinted to violet-tinted values, including the fallbacks in the 3D component and the static gradient sphere.
- The link preview image is redrawn with the lighter magenta for its divider and sphere glow.
- The language dots in the project list, the window buttons of the mockups, the syntax-highlighting colors and the browser icon stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `portfolio-ui`: "Light and Dark Color Modes" no longer promises one single accent color. It allows a fill tone for primary buttons and a readable tone of the same hue for highlights, numbers and dividers, which may differ per mode.

## Impact

- `src/app/globals.css`: accent, accent label, accent text and sphere tokens in both modes; the three decorative line rules.
- `src/components/sections/SkillsSection.tsx`, `src/components/project/ProjectPage.tsx`: decorative `bg-accent` markers.
- `src/components/hero/DisplacementSphere.tsx`: hard-coded fallback colors.
- `src/app/[lang]/og.png/route.tsx`: its own copy of the accent and sphere colors.
- `CONTINUATION.md`: the contrast note names the token pairs to re-check.
- No dependencies, routes or content change. Shared links show the old preview image until the platforms' caches expire.
