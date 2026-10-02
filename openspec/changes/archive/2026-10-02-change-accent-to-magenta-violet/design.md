# Design

## Context

All accent styling runs through tokens in `src/app/globals.css` (`--accent`, `--accent-fg`, `--accent-text`, `--sphere-base`, `--sphere-light`), set once for dark and once for light. Two places keep their own copies: the fallbacks in `DisplacementSphere.tsx` and the link preview route `src/app/[lang]/og.png/route.tsx`.

The current cyan is light enough to be a fill with a dark label and, in dark mode, text on `#111`. A dark violet is not: `#a21caf` reaches only 2.99:1 on `#111`. The `portfolio-ui` spec requires 4.5:1 for every text token and for the label on accent buttons.

## Goals / Non-Goals

**Goals:**
- A dark magenta-violet accent that meets 4.5:1 for every text pair in both modes.
- Accent lines and the sphere stay as present in dark mode as they are today.

**Non-Goals:**
- No change to neutrals, syntax highlighting, language dots, mockup window buttons or the browser icon.
- No shared color constant between CSS and the preview image route.

## Decisions

### Token values

| Token | Dark | Light |
|---|---|---|
| `--accent` | `#a21caf` | `#a21caf` |
| `--accent-fg` | `#ffffff` | `#ffffff` |
| `--accent-text` | `#e879f9` | `#a21caf` |
| `--sphere-light` | `#e879f9` | `#e879f9` |
| `--sphere-base` | `#3f3a47` | `#f0eaf3` |

Measured contrast:

| Pair | Ratio |
|---|---|
| `#ffffff` on `#a21caf` (button label) | 6.32 |
| `#e879f9` on `#111111` / `#1a1a1a` (dark text) | 7.67 / 7.07 |
| `#a21caf` on `#f2f2f2` / `#ffffff` (light text) | 5.65 / 6.32 |

Alternatives considered:
- One light violet (`#b18cff`) as fill and dark-mode text, keeping today's structure. Rejected: the owner asked for a dark tone.
- `#9b1fc1`, slightly more violet. Equivalent contrast; `#a21caf` was chosen for the stronger magenta lean.
- `#c026d3` as a single tone for both. Rejected: 4.01:1 on `#111` and 4.21:1 on `#f2f2f2` both fail.

### Decorative lines use `--accent-text`

The section divider, the navigation hover line and the small `bg-accent` markers in Skills and the project page switch from `--accent` to `--accent-text` (`bg-accent-text`). The large block behind the profile picture in About stays on `--accent`: it is a fill like the buttons, and a block in the lighter tone would dominate the section. In light mode both tokens are equal, so nothing changes there; in dark mode the lines get the lighter magenta.

Alternative: a separate `--accent-line` token. Rejected: it would always equal `--accent-text`, so it adds a name without adding a choice.

After this, `--accent` is used for the button fill, the About block and the `::selection` tint.

### Sphere

`--sphere-light` is the lighter magenta `#e879f9` in both modes. In dark mode it makes the sphere glow. In light mode the hero title overlaps the sphere: with `#a21caf` as the light, the grey second title line (`--muted`) measured about 2.6:1 against the sphere in WebKit, down from about 5:1 with cyan; with `#e879f9` it measures about 4:1, above the 3:1 needed for text of that size. `--sphere-base` swaps its cyan tint for a violet one at a similar lightness. The fallbacks in `DisplacementSphere.tsx` are updated to the dark-mode values.

### Link preview image

The image is always dark, so it uses `#e879f9` for the divider and the glow (`rgba(232, 121, 249, …)`), and a violet-tinted sphere tone in place of `#34403f`. The values stay a local copy: the route renders outside the CSS, and one constant in one file is cheaper than a shared module for three values.

## Risks / Trade-offs

- Dark mode shows two accent tones (dark button, light text) → both share one hue; checked side by side in the visual pass.
- `::selection` is 40 % of a darker color and may be faint on `#111` → check in Safari; raise the mix percentage if selected text is hard to see.
- `filter: brightness(1.08)` on button hover is less visible on a dark fill → check; adjust the factor if the hover is not noticeable.
- Shared links keep the cyan preview until caches expire → accepted; no action.
