## RENAMED Requirements

- FROM: `### Requirement: Design System with Color Modes`
- TO: `### Requirement: Dark Design System`

## MODIFIED Requirements

### Requirement: Dark Design System
The system SHALL style the site from color tokens in a single dark mode that fits the space scene. There SHALL be no color mode toggle and no light mode, and the page SHALL render dark from the first paint regardless of the operating system's color scheme. Solid, translucent surfaces SHALL be used instead of backdrop blur over the 3D canvas.

#### Scenario: User switches color mode
- **WHEN** the user looks for a color mode toggle in the navigation bar
- **THEN** there is none: the navigation bar shows the section links, the GitHub link and the language switch only

#### Scenario: Returning visitor loads the page
- **WHEN** a visitor whose operating system prefers a light color scheme opens the site
- **THEN** the page renders in the dark design from the first paint, without a flash of light colors

### Requirement: Readable Text Contrast
The system SHALL keep every text color token at a contrast ratio of at least 4.5:1 against both the page background and card surfaces.

#### Scenario: User reads small secondary text
- **WHEN** small labels such as stat captions, years or the language pill are displayed
- **THEN** their contrast against the background and cards is at least 4.5:1

### Requirement: Localized Not Found Page
The system SHALL respond to unknown URLs with a styled, localized 404 page in the site's dark design, returning HTTP status 404 and marked noindex.

#### Scenario: Visitor opens a missing page
- **WHEN** a visitor requests an unknown path such as `/de/missing` or an unsupported locale like `/fr`
- **THEN** a 404 page is shown in German for `/de/…` paths and in English otherwise, with a link back to that language's home page
