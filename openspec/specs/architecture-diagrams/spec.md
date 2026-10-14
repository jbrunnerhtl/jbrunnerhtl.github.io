# architecture-diagrams Specification

## Purpose
Shows how each featured project is built: one architecture diagram per project, verified against its repository, readable at a glance and explained block by block when the visitor activates a block.

## Requirements

### Requirement: Diagram Content
Each featured project SHALL have one architecture diagram. The diagram SHALL show the project's main building blocks, grouped in labelled layers or groups, and the links between them. Each block SHALL have a name and a short label. A link MAY carry a short label, such as a protocol or the data it carries. External services SHALL be marked as external. Below the blocks, the diagram MAY list supporting tools as chips.

#### Scenario: Visitor looks at Driving Planner
- **WHEN** the Driving Planner diagram is shown
- **THEN** it shows a client layer with the Vue single-page app, an API layer with router, service and repository, a data layer with the unit of work and SQLite, and a background geocoder linked to Nominatim, which is marked as external

#### Scenario: Visitor looks at the Crow Demo Backend
- **WHEN** the Crow Demo Backend diagram is shown
- **THEN** it shows the path of a request from the route through JSON validation and the creation of a laptop or server to the device repository interface and its in-memory implementation

### Requirement: Diagrams Verified Against the Repository
Every block, link, label and explanation SHALL match the project's repository source at the time of writing. A diagram SHALL NOT show components, links or behaviour that the repository does not contain.

#### Scenario: Visitor checks a block
- **WHEN** a visitor reads the explanation of Driving Planner's "Unit of Work" block and then looks at the repository
- **THEN** the repository contains a unit of work that runs each change in a transaction

### Requirement: Block Explanation
Activating a block SHALL highlight it, its direct neighbours and the links between them in the accent colour, dim all other blocks and links, and show the block's name and a one- to three-sentence explanation below the diagram. Activating the same block again, activating outside the diagram, or pressing Escape SHALL reset the diagram. Activating another block SHALL switch to it.

#### Scenario: Visitor clicks a block
- **WHEN** the visitor clicks the "Service" block in the Driving Planner diagram
- **THEN** "Service" and its direct neighbours "Router", "Repository" and "Unit of Work" are highlighted together with the links to them, the other blocks are dimmed, and the explanation of the service appears below the diagram

#### Scenario: Visitor resets the diagram
- **WHEN** a block is active and the visitor presses Escape or clicks outside the diagram
- **THEN** no block is highlighted or dimmed and the explanation is hidden

#### Scenario: Visitor prefers reduced motion
- **WHEN** reduced motion is requested and the visitor activates a block
- **THEN** the highlight and the explanation appear immediately, without transitions

### Requirement: Accessible Diagram
Each diagram SHALL have an accessible name naming the project. Blocks SHALL be buttons that can be reached with the keyboard and activated with Enter or Space, and SHALL expose whether they are active. The explanation SHALL be announced politely when it changes. Purely decorative parts, such as arrows and the background pattern, SHALL be hidden from assistive technology.

#### Scenario: Keyboard user explores a diagram
- **WHEN** a keyboard user tabs to a block and presses Enter
- **THEN** the block becomes active, its pressed state is exposed, and a screen reader announces its explanation

### Requirement: Diagram Without JavaScript
The diagram SHALL be rendered completely in the HTML, so that every block, label, link label and layer name is visible and readable without JavaScript. Only the interaction MAY be missing without JavaScript.

#### Scenario: Visitor without JavaScript
- **WHEN** a project's diagram is viewed with JavaScript disabled
- **THEN** all its layers, blocks and labels are visible, nothing is dimmed, and no space is left empty for an explanation

### Requirement: Diagram Layout on All Screens
The diagram SHALL fit its column from 320px to 2560px wide without horizontal overflow. When the space is too narrow for blocks side by side, the blocks SHALL stack and the links SHALL point down.

#### Scenario: Diagram on a phone
- **WHEN** the Driving Planner diagram is viewed on a 390px wide screen
- **THEN** router, service and repository are stacked with downward links between them, and the page does not overflow horizontally

### Requirement: Shared Visual Language
All six diagrams SHALL share one visual style built from the site's colour tokens: a panel with a subtle background pattern, outlined blocks, small labels in the monospaced font and the accent colour only for highlights. The diagram SHALL follow the colour mode, and all of its text SHALL keep a contrast of at least 4.5:1 in both modes.

#### Scenario: Diagram in light mode
- **WHEN** a diagram is shown in light mode and a block is active
- **THEN** the panel, blocks and labels use the light colour tokens and the highlight uses the light-mode accent colours

### Requirement: Localized Diagram Text
All text in a diagram, including layer names, block names and labels, link labels, explanations and the accessible name, SHALL be in the current language. Technical names (for example "SQLite" or "Express 5") MAY stay the same in both languages.

#### Scenario: German project page
- **WHEN** the German page of Flashcards is displayed
- **THEN** its diagram's layer names, labels and explanations are in German
