## Purpose

Turns the portfolio page into a scroll-driven journey through space: each part of the portfolio is a station whose content arrives, holds while it is read, and flies past, with navigation, focus and a stacked-page fallback that keep the content usable for everyone.

## ADDED Requirements

### Requirement: Stations Along the Journey
When journey mode is active, the system SHALL present the page content as a sequence of stations in this order: Hero (start), GitHub stats, About, one station per featured project, the more-repositories list, Skills, and Contact (destination). Only one station's content SHALL be fully shown at a time. The content SHALL float in space without a surrounding dark panel, beside its station's galaxy: on wide screens it takes the side opposite the galaxy, and a soft, edgeless shadow and text shadow keep it readable. The GitHub stats SHALL be shown as large glowing numbers with their labels, and the skills as static, readable chips grouped by category, with every skill visible at once. The content SHALL remain in the document in its reading order, as real, selectable text and working links, in both languages.

#### Scenario: User scrolls from start to destination
- **WHEN** the user scrolls from the top of the page to the bottom
- **THEN** the stations follow each other in the order Hero, stats, About, Projects (one per project, then the repository list), Skills, Contact, and at any scroll position at most one station's content is fully shown

#### Scenario: Assistive technology reads the page
- **WHEN** a screen reader or search engine reads the page in journey mode
- **THEN** it finds the same headings, text and links in the same order as in the stacked page

### Requirement: Arrive, Hold and Leave
Each station SHALL go through three phases, driven by the scroll position: its content arrives from the depth of space (growing from small and transparent to full size and opacity), holds fully readable, then flies past the viewer (growing further while fading out) as the next station approaches. The hold phase SHALL be short (about a third of a viewport of scrolling, plus any tall-content overflow), and the content SHALL keep drifting subtly while held, so every scroll step visibly changes the scene. Scrolling up SHALL play the phases backwards. The phases SHALL be a pure function of the scroll position and SHALL NOT cause layout shifts or React re-renders per frame.

#### Scenario: User arrives at a station
- **WHEN** the user scrolls towards the About station
- **THEN** the About content emerges from the distance and settles at full size, and keeps drifting gently while the user scrolls within the short hold range

#### Scenario: User leaves a station
- **WHEN** the user scrolls past the end of a station's hold range
- **THEN** its content grows past the viewer and fades out, while the next station's content begins to arrive from the depth

#### Scenario: User scrolls back
- **WHEN** the user scrolls up from a station to the previous one
- **THEN** the previous content comes back from behind the viewer into its hold state, mirroring the forward journey

#### Scenario: Pointer over a station that is not shown
- **WHEN** a station's content is arriving, leaving or hidden
- **THEN** it does not receive clicks or hover, so only the station being held can be interacted with

### Requirement: Layered Content Effects
In journey mode, the content of a station SHALL be split into depth layers (for example the heading, the text, and each card, timeline item or list row) that arrive one after another from different depths and fly past at different speeds, so the content itself has parallax. Highlighted headline words SHALL shimmer as the station is scrolled through. The About timeline SHALL draw its line and light up its milestones as the station arrives. The effects SHALL be driven by the scroll position (no timers), SHALL NOT change the stacked fallback, and SHALL NOT delay readability: every layer is fully shown during the hold.

#### Scenario: Projects station arrives
- **WHEN** the first Projects station arrives
- **THEN** the heading arrives first, then the intro, then the card from further back, each settling at full size and opacity by the hold

#### Scenario: About station arrives
- **WHEN** the About station arrives
- **THEN** the timeline line draws from top to bottom and each milestone lights up as the line reaches it

#### Scenario: Scrolling within a held station
- **WHEN** the user scrolls a little while a station is held
- **THEN** its layers shift slightly against each other and the highlighted headline shimmers, without the content becoming hard to read

### Requirement: Tall Station Content
When a station's content is taller than the viewport (for example a long project card on a short phone screen), the system SHALL move that content upwards through the viewport during the hold phase in step with scrolling, so all of it can be read before the station leaves.

#### Scenario: Long content on a small screen
- **WHEN** the user holds at a station whose content is taller than the viewport
- **THEN** further scrolling first reveals the rest of the content from top to bottom, and only then does the station leave

### Requirement: Journey Navigation and Focus
Navigation to a section (navbar links, the hero buttons) SHALL fly to the hold point of the first station of that section. The navbar SHALL mark the section whose station is currently held (none at the Hero). When keyboard focus moves to an element inside a station that is not being held, the system SHALL fly to that station's hold point so the focused element is visible.

#### Scenario: User selects Projects in the navbar
- **WHEN** the user selects "Projects" in the navbar from the Hero
- **THEN** the page smooth-scrolls, the journey flies past the stats and About stations and stops with the first project fully shown, and "Projects" is marked as active

#### Scenario: User tabs through the links
- **WHEN** the user presses Tab from the last link of the About station
- **THEN** the journey flies to the next station containing a focusable element, and the focused element is visible and highlighted

### Requirement: Journey Mode and Stacked Fallback
The system SHALL enable journey mode only in a browser with JavaScript where the 3D scene will be shown (no reduced-motion preference, no data saving, not a low-end device, WebGL available). Otherwise the page SHALL keep the stacked layout: sections one below the other in normal document flow, with the static gradient background. The server-rendered HTML SHALL be the stacked layout, so the page works without JavaScript.

#### Scenario: Visitor prefers reduced motion
- **WHEN** the operating system's reduced-motion preference is enabled
- **THEN** the page shows the stacked layout with all sections in normal flow and no station transitions

#### Scenario: Browser without WebGL
- **WHEN** WebGL is unavailable
- **THEN** the stacked layout is shown and no content is left hidden or transformed

#### Scenario: Journey mode starts after load
- **WHEN** journey mode switches on after hydration at the top of the page
- **THEN** the Hero station is shown at its hold state without a visible jump
