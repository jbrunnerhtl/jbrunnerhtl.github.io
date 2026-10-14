# Proposal

## Why

The projects are shown as code excerpts in device frames. The owner finds the laptop animation cheap, and several reworked animations (line reveal, colour wipe, scroll-driven depth) did not fix the real problem: a code excerpt says little about a project. An architecture diagram per project shows how each one is built and what decisions went into it. It also gives every project a shape of its own instead of six similar code windows.

## What Changes

- **BREAKING (content):** No project code is shown anywhere on the site any more. The code mockups (laptop, application window, terminal) on the home page and the "From the code" section with its excerpts on the project pages are removed.
- Every featured project gets an architecture diagram built from its repository. Its building blocks are grouped in labelled layers and connected by labelled links, in a form that suits the project:
  - Driving Planner: client, API and data layers, plus the background geocoder
  - Flashcards: model, view and presenter, with the card selection strategy
  - 3D Vector Viewer: the per-frame loop
  - Crow Demo Backend: the request pipeline
  - DrivingTracker: the list chain from the observable list to the table, plus the H2 database
  - RPN Calculator: the project dependencies
- The diagram is complete and readable without interaction and without JavaScript. Activating a building block (click, tap or keyboard) highlights it, its direct neighbours and the links between them, dims the rest and shows a short explanation below. A second activation, a click outside or Escape resets it.
- One visual language for all six diagrams, in the site's colour tokens and accent colour, in both colour modes. On narrow screens the blocks stack and the links point down, without horizontal overflow.
- The home page shows the diagram where the mockup was, with the outline lettering of the language kept behind it. The project page shows the same diagram where its mockup was.
- Diagram texts (layer names, block names, short labels, explanations, the accessible name) exist in English and German. The code-related texts (`mockupLabel`, `snippetNotes`, the "From the code" and "Source" labels) are removed.
- Removed code: the mockup component, `src/data/snippets.ts`, `src/lib/highlight.ts`, the mockup and shiki CSS, and the `shiki` dependency.
- Not part of this change: interactive mini demos on the project pages. They follow in a separate change (`add-project-mini-demos`).

## Capabilities

### New Capabilities

- `architecture-diagrams`: the per-project architecture diagram: what it contains and how it is verified, its layout in both colour modes and on narrow screens, the click-to-explain interaction, and its accessibility.

### Modified Capabilities

- `project-showcase`: "Project Sections" puts the diagram where the mockup was. "Code Mockups" is removed. "Verified Project Data and Links" verifies the diagrams instead of code excerpts.
- `project-pages`: "Project Page Content" replaces the mockup with the diagram and drops the required detail snippet. The phone scenario no longer mentions code lines.
- `portfolio-ui`: "Reveal and Text Effects" reveals diagrams instead of mockups.

## Impact

- Code: `src/components/sections/ProjectsSection.tsx`, `src/components/project/ProjectPage.tsx`, the home and project page routes that call the highlighter, a new diagram component (a server-rendered part and a small client part for the interaction), new diagram data per project, `src/data/portfolioData.ts` (`mockup` and `details` fields are replaced), `src/app/globals.css`.
- Removed: `src/components/mockups/Mockup.tsx`, `src/data/snippets.ts`, `src/lib/highlight.ts`.
- Texts: `src/i18n/dictionaries/en.ts` and `de.ts` (new diagram texts, removed code texts).
- Dependencies: `shiki` is removed. Nothing is added.
- Research: each diagram is checked against the repository source, including the two organization repositories (Driving Planner, Flashcards) and the `develop` branch of Flashcards.
- Docs: `CONTINUATION.md` (code snippet facts replaced by diagram facts), README if it mentions the mockups.
- No change to routes, metadata, structured data, deployment or the hero sphere.
