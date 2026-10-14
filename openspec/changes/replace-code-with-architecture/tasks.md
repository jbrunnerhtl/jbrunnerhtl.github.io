# Tasks

## 1. Repository research

- [ ] 1.1 Clone the six repositories read-only into the scratchpad (Flashcards on `develop`, Driving Planner and Flashcards from their organizations) without building or running them; verify each clone exists at the expected branch with `git -C <dir> branch --show-current`
- [ ] 1.2 For each project, draft the diagram in a scratchpad note from the source (layers, blocks, connectors with labels, external services, chips), with the repository path that supports every block and connector, and with explanations of one to three sentences written from the code; verify that every block and connector in the note has a path and that the path exists in the clone

## 2. Data model and the first diagram

- [ ] 2.1 Create `src/data/architecture.ts` with the layered model from design.md (layers, rows, block ids, `external`, `source`, connectors with `from`/`to`, optional return connector, chips) and the Driving Planner diagram from the note; verify with `npx tsc --noEmit`
- [ ] 2.2 Add `projects.items["driving-planner"].architecture` (accessible name, layer names, block names, labels and explanations, link labels) to `en.ts` and `de.ts`, and type the data so that an unknown block or layer id fails; verify `npx tsc --noEmit` passes, and that it fails after a block id is deliberately misspelled (then revert)

## 3. Diagram component

- [ ] 3.1 Build `src/components/architecture/ArchitectureDiagram.tsx` per design.md: complete server-rendered HTML, blocks as `<button aria-pressed>`, decorative arrows and pattern `aria-hidden`, active block as state, neighbours and links derived from the connectors, explanation in an `aria-live="polite"` region that collapses when empty, Escape and click outside only while active; no text through CSS `content`; verify with `npx tsc --noEmit && npm run lint`
- [ ] 3.2 Add the "Architecture diagrams" CSS to `src/app/globals.css` from tokens only (panel with dot pattern, blocks, inline arrows, connectors with labels, highlight and dimmed states, explanation, container query below about 560px, transitions off under reduced motion); verify `npm run build` passes
- [ ] 3.3 Render the Driving Planner diagram in place of the mockup in `ProjectsSection.tsx` and `ProjectPage.tsx`, behind the outline lettering on the home page, with plain `data-reveal`; verify with `npm run build` that `out/en/index.html` and `out/de/projects/driving-planner/index.html` contain every block name of the diagram as text
- [ ] 3.4 Test the interaction with Playwright in WebKit in the scratchpad: clicking "Service" lights service, router and repository and their two links and dims the rest; clicking it again, clicking outside and pressing Escape reset it; Tab and Enter activate a block and set `aria-pressed="true"`; the explanation region updates; with JavaScript disabled all blocks are visible and nothing is dimmed; with reduced motion the change is instant; verify each check passes
- [ ] 3.5 Check the Driving Planner diagram in WebKit in dark and light mode at 1440, 1024, 390 and 320px on the home page and the project page, in English and German; verify there is no horizontal overflow, rows stack with downward arrows in narrow columns, and the labels don't break awkwardly
- [ ] 3.6 Extend the contrast script from the accent change to the diagram's text colours (block labels, link labels, layer names, dimmed state excluded, highlighted link label) in both modes; verify every pair is at least 4.5:1

## 4. The other five diagrams

- [ ] 4.1 Add the Flashcards diagram (data and EN/DE texts) from the note, with the card selection strategy as its own layer; verify `npx tsc --noEmit` and check it in WebKit at 1440 and 390px in both languages
- [ ] 4.2 Add the 3D Vector Viewer diagram with the per-frame loop and its return connector; verify `npx tsc --noEmit` and check in WebKit at 1440 and 390px that the return connector reads clearly in both layouts
- [ ] 4.3 Add the Crow Demo Backend diagram with the request pipeline and the repository interface; verify `npx tsc --noEmit` and check in WebKit at 1440, 1024 and 390px that the pipeline row isn't cramped (use two rows if it is)
- [ ] 4.4 Add the DrivingTracker diagram with the list chain and the H2 data layer; verify `npx tsc --noEmit` and check in WebKit at 1440 and 390px
- [ ] 4.5 Add the RPN Calculator diagram with App, Logic, Core and Tests; verify `npx tsc --noEmit` and check in WebKit at 1440 and 390px
- [ ] 4.6 Compare every diagram once more with its scratchpad note and clone (blocks, connectors, labels, explanations in both languages); verify no block is without a `source` and each `source` path exists in its clone
- [ ] 4.7 Replace the code snippet facts in `CONTINUATION.md` with the diagram facts (where the data and texts live, that every block carries a `source` path, how to recheck it); verify by reading the file

## 5. Removing the code

- [ ] 5.1 Delete `src/components/mockups/Mockup.tsx`, `src/data/snippets.ts` and `src/lib/highlight.ts`, remove the `highlightAll` calls from both route files and the `mockup` and `details` fields from `ProjectItem` and the project data; verify with `npx tsc --noEmit` and `grep -rn "snippet\|Mockup\|highlight" src` returning nothing relevant
- [ ] 5.2 Remove `mockupLabel`, `snippetNotes`, `page.code` and `page.source` from `en.ts` and `de.ts`; verify `npx tsc --noEmit` and that the built project pages contain no "From the code" or "Aus dem Code" section
- [ ] 5.3 Delete the mockup, shiki and `device` reveal CSS from `globals.css`; verify `grep -n "mockup\|shiki\|device" src/app/globals.css` returns nothing
- [ ] 5.4 Uninstall `shiki` with npm; verify `npm ls shiki` reports it missing and `npm run build` passes
- [ ] 5.5 Update `README.md` where it mentions code mockups or snippets; verify with `grep -n -i "mockup\|snippet\|shiki" README.md`

## 6. Integration check

- [ ] 6.1 Run `npx next typegen && npx tsc --noEmit && npm run lint && npm run build`; verify all pass
- [ ] 6.2 Check the home page and all six project pages in WebKit: dark and light, 1440/1024/390/320px, without JavaScript and with reduced motion; verify no horizontal overflow, all content visible without JavaScript, the diagrams reveal like the surrounding text, and no project code appears anywhere
- [ ] 6.3 Run `openspec validate replace-code-with-architecture --strict`; verify it passes
- [ ] 6.4 Commit locally on `feature/architecture-diagrams` (no push); verify `git status` is clean and `git log` shows the commit

## Workflow follow-up

- The owner pushes the branch and merges it into `main`.
- Archive the change with `/opsx:archive`. Afterwards, edit the Purpose of `openspec/specs/project-showcase/spec.md`, which still mentions "code mockups", to say "architecture diagrams".
- Next change: `add-project-mini-demos` (interactive demos on the project pages, in the same colour scheme).
