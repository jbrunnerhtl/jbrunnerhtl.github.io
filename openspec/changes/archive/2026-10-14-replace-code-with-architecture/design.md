# Design

## Context

- Both places that show code are client components: `ProjectsSection.tsx` (home page) and `ProjectPage.tsx` (project pages). The static export still renders them to HTML at build time.
- The route files `src/app/[lang]/page.tsx` and `src/app/[lang]/projects/[slug]/page.tsx` call `highlightAll()` from `src/lib/highlight.ts` (shiki, server-only) and pass the HTML down. `ProjectItem` in `portfolioData.ts` carries `mockup` and `details`, which point into `src/data/snippets.ts`.
- Texts live in `src/i18n/dictionaries/{en,de}.ts`, and `de.ts` must have exactly the shape of `en.ts` (checked by `tsc`).
- Reveal: `RevealObserver` sets `data-revealed` on `[data-reveal]`. The `device` variant and the laptop lid CSS exist only for the mockups.
- A working prototype of the Driving Planner diagram (layout, highlight and explanation, narrow layout, both colour modes) was checked in WebKit during exploration. It is the visual reference for this change.

## Goals / Non-Goals

**Goals:**
- One data model and one component that can draw all six diagrams.
- Every diagram is traceable to its repository.
- The interaction is small: no new dependency, no client-side layout engine.

**Non-Goals:**
- Mini demos (separate change `add-project-mini-demos`).
- Animated data flow (pulses along links) or step-by-step scenarios.
- Free-form graph layouts with crossing or curved edges.

## Decisions

**One layered layout model for all diagrams.** A diagram is a vertical list of *layers*. Each layer has a name and one or more *rows* of blocks, and blocks in a row are joined by inline arrows. *Connectors* between two layers are drawn as a short vertical line with an optional label, and they name the two blocks they join. A row may end in a *return* connector (for the frame loop of the 3D Vector Viewer). Each project's shape comes from its content:

| Project | Layers (top to bottom) |
|---|---|
| Driving Planner | Client · API (router → service → repository) · Data (unit of work → SQLite) · Background/External (geocoder ⇢ Nominatim) |
| Flashcards | View ↔ Presenter ↔ Model · Card selection (CardSelector → random / weighted) · Storage and providers |
| 3D Vector Viewer | App (window, camera, main loop) · Per frame (input → grid → vectors → labels → panel, back to input) · Library |
| Crow Demo Backend | HTTP · Pipeline (route → JSON check → device factory) · Storage (repository interface → in-memory) |
| DrivingTracker | UI (FXML views, controllers) · List chain (observable → filtered → sorted → table) · Data (JDBC → H2, two tables) · CSV |
| RPN Calculator | App (Avalonia, UI in C#) · Logic (stack calculator, function evaluation) · Core (interface, exceptions) · Tests |

The exact blocks are set during the repository check (tasks, section 2), not here.
- Alternative: free coordinates with SVG edges. Rejected: every diagram would need a second layout for phones, and text in SVG is harder to keep accessible and readable.
- Alternative: an auto-layout library (elkjs, dagre) or Mermaid. Rejected: adds weight to the client, and the result looks generic. The owner explicitly asked for a premium look.

**Structure in data, words in the dictionaries.** `src/data/architecture.ts` holds each project's layers, rows, block ids, connectors, external flags and chips. It has no text, only ids and technical names that are the same in both languages. Each block also records the repository path that supports it (`source`), which is not rendered but makes rechecking quick. The dictionaries hold the visible words under `projects.items.<id>.architecture`: the accessible name, layer names, and per block the name, short label and explanation, plus link labels. Types derived from `en.ts` make a missing or misspelled id a type error.
- Alternative: the whole diagram per language in the dictionaries. Rejected: the structure would exist twice and could drift apart.

**One client component, server-rendered.** `ArchitectureDiagram` replaces `Mockup` in both places. It renders the complete diagram as HTML, with blocks as `<button aria-pressed>` and arrows and the dot pattern as `aria-hidden` elements. The active block is React state. Neighbours and lit links are derived from the connector list. Click outside and Escape are document listeners that exist only while a block is active. The explanation is an `aria-live="polite"` region that collapses to zero height when empty, so the no-JS HTML has no gap. No arrow or label text is drawn through CSS `content` (Safari rule from the owner); pseudo-elements are used only for lines and arrowheads.

**Narrow layout through a container query.** The diagram is a size container. Below about 560px of its own width, rows switch to a column and the arrows turn downward. This responds to the column width, not the viewport, so the same rule works in the 7/12 home column at 1024px and on phones.

**Styling in `globals.css`, from tokens only.** A new "Architecture diagrams" block replaces the mockup, shiki and `device` reveal CSS. Highlights use `--accent` for lines and borders and `--accent-text` for text. The contrast of every text colour is checked again in both modes, as the continuation notes require after colour work. Transitions are short (opacity, border colour, box shadow) and disabled under reduced motion.

**Show what the code does, mark what it doesn't.** When a component exists but isn't used by the app, the diagram may show it only with an explicit note. This applies to Flashcards: the card selection strategy (random or weighted, weights 8/4/2/1 and 3 for unrated cards) is a block in the model layer labelled as tested but not yet wired into the study mode, which shuffles its cards. The owner chose this over leaving the strategy out.
- Alternative: leave the strategy out. Rejected by the owner: it is real, tested work, and hiding it loses the most interesting design decision of the project.

**Reveal stays generic.** The diagram uses the plain `data-reveal` fade and rise like the text beside it. The `device` variant and its lid rules are deleted.

**Removal in one go.** `Mockup.tsx`, `snippets.ts`, `highlight.ts`, the `mockup` and `details` fields, the `highlightAll` calls in both routes, the code-related dictionary keys (`mockupLabel`, `snippetNotes`, `page.code`, `page.source`) and the `shiki` dependency are removed in this change. Leaving them would keep dead code and a build-time dependency for nothing.

## Risks / Trade-offs

- [A diagram claims something the repository doesn't contain] → Each repository is cloned read-only into the scratchpad and read (never built or run). Every block records its `source` path, and the explanations are written from the code, not from the existing prose alone. Flashcards is checked on `develop`.
- [Rows with four or five blocks are cramped in the 7/12 home column] → Test at 1440 and 1024px. If needed, a layer may use two rows, or the container query threshold is raised.
- [German texts are longer and break the block labels] → Block labels stay short (two to four words). Test the German pages at 320px.
- [Six interactive diagrams on one page cost client work] → The state is per diagram, and the document listeners exist only while a block is active. No layout is measured in JavaScript.
- [The outline lettering behind the opaque panel shows less] → Accepted, as with the mockups before. It still shows around the panel's edges.
- [Content loss: the code excerpts and their notes disappear] → Intended by the owner. The "How it's built" texts stay and keep the technical detail.

## Migration Plan

Work happens on `feature/architecture-diagrams` (from `main`), committed locally only; the owner pushes and merges. Rollback is reverting the merge. Nothing outside the static site changes.
