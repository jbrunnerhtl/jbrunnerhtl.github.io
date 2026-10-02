# Tasks

## 1. Color tokens

- [x] 1.1 Set `--accent`, `--accent-fg`, `--accent-text`, `--sphere-base` and `--sphere-light` in both mode blocks of `src/app/globals.css` to the values in design.md; verify with `grep -n "2de2f0\|00707e\|071417\|3a4447\|eaf2f3" src/app/globals.css` returning nothing
- [x] 1.2 Write a contrast script in the scratchpad that checks `--accent-fg` on `--accent`, and `--accent-text`, `--fg`, `--muted` and `--faint` on `--bg` and `--surface` for both modes; verify every pair prints at least 4.5
- [x] 1.3 Update the contrast note in `CONTINUATION.md` to name the new pairs (white label on the fill, lighter accent text in dark mode); verify the note matches the token values

## 2. Accent lines

- [x] 2.1 Switch the section divider, its notched bar and the navigation hover line in `globals.css` from `var(--accent)` to `var(--accent-text)`; verify `grep -n "var(--accent)" src/app/globals.css` lists only the token mapping, `::selection` and `.btn-accent`
- [x] 2.2 Change the small `bg-accent` markers in `SkillsSection.tsx` and `ProjectPage.tsx` to `bg-accent-text`; verify `grep -rn "bg-accent " src/components` finds only the block behind the profile picture in `AboutSection.tsx`

## 3. Sphere and preview image

- [x] 3.1 Update the fallback colors in `src/components/hero/DisplacementSphere.tsx` to the dark-mode `--sphere-base` and `--sphere-light`; verify no cyan hex remains in the file
- [x] 3.2 Update `ACCENT`, the glow `rgba(...)` values and the sphere tone in `src/app/[lang]/og.png/route.tsx` per design.md; verify by running `npm run build` and opening `out/en/og.png` and `out/de/og.png`, which show a magenta divider and glow

## 4. Integration check

- [x] 4.1 Run `npm run lint` and `npm run build`; verify both finish without errors
- [x] 4.2 Check the home page, a project page and the 404 page in WebKit in dark and light mode: buttons (label, hover), dividers, section numbers, active navigation link, focus ring, text selection and the hero sphere; verify each is clearly visible and no cyan remains, and adjust the selection mix or hover brightness if design.md's risks apply
- [x] 4.3 Run `openspec validate change-accent-to-magenta-violet --strict`; verify it passes
