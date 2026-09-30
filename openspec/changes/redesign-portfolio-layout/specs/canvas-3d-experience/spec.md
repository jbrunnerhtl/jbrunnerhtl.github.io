## ADDED Requirements

### Requirement: Hero Displacement Sphere
The system SHALL render a large 3D sphere behind the hero text, offset towards the right on wide screens and filling the hero on narrow ones.
- **Surface:** continuously deformed by animated noise into a faceted, organic shape, and lit so its facets read as light and shadow.
- **Motion:** it slowly morphs over time and turns towards the pointer with a damped, springy motion. On touch devices it turns with the device's scroll position in the hero instead.
- **Colors:** taken from the current color mode (dark: deep neutral with an accent-colored light; light: pale with an accent-colored light). They SHALL update without reloading when the mode changes.
- **Transition:** the sphere SHALL fade in when ready, and fade and shift out of view as the hero is scrolled away.
- **Assets:** the sphere SHALL be generated in code, with no downloaded textures or models.

#### Scenario: Visitor moves the mouse over the hero
- **WHEN** the pointer moves across the hero on a desktop
- **THEN** the sphere turns smoothly towards the pointer and settles without a jump when the pointer stops

#### Scenario: Visitor switches the color mode
- **WHEN** the visitor toggles between dark and light mode while the hero is visible
- **THEN** the sphere's colors change to the new mode's palette without reloading the page or the scene

#### Scenario: Visitor scrolls past the hero
- **WHEN** the hero leaves the viewport
- **THEN** the sphere has faded out and the page below shows no 3D canvas

### Requirement: Hero Sphere On-Demand Rendering
The system SHALL render the sphere only while the hero is at least partly in view and the tab is visible. It SHALL stop rendering completely when the hero is out of view or the tab is hidden. Phones SHALL render at a capped pixel density. When the user prefers reduced motion, the sphere SHALL be rendered once as a still image and SHALL NOT morph or follow the pointer. The animation clock SHALL advance only on rendered frames, so pausing never causes a visible jump.

#### Scenario: User reads the projects
- **WHEN** the hero is scrolled out of view
- **THEN** the canvas renders no frames

#### Scenario: User returns to the hero
- **WHEN** the user scrolls back up to the hero
- **THEN** rendering resumes from the paused shape without a jump

#### Scenario: Visitor prefers reduced motion
- **WHEN** the operating system's reduced-motion preference is enabled and the page is capable of 3D
- **THEN** the sphere is shown as a still shape that neither morphs nor follows the pointer

### Requirement: Deferred Sphere Loading
The system SHALL load the sphere's code only after the browser is idle following the first render. It SHALL show a static, code-generated gradient shape in the sphere's place instead of loading 3D at all in any of these cases:
- data saving is enabled
- the device reports 2 GB of memory or less, or 2 CPU cores or fewer
- WebGL is unavailable
- the visitor is a known search engine or link-preview crawler

The device pixel ratio SHALL be capped at 1.5 (1.25 on phones). The canvas SHALL only be mounted on pages that have the hero.

#### Scenario: Page loads on a capable device
- **WHEN** the home page first loads
- **THEN** the initial JavaScript excludes three.js, and the sphere fades in over the static gradient shape once its code has loaded during idle time

#### Scenario: Browser does not support WebGL
- **WHEN** WebGL initialization fails or is disabled
- **THEN** the static gradient shape remains without throwing unhandled exceptions

#### Scenario: Visitor opens a project page
- **WHEN** a project detail page is loaded directly
- **THEN** no 3D code is downloaded

## REMOVED Requirements

### Requirement: Scroll-Driven Flight Through Space
**Reason**: The redesign drops the scroll-driven journey. The page scrolls natively, and the only 3D element is the hero sphere.
**Migration**: See "Hero Displacement Sphere".

### Requirement: Starfield All Around
**Reason**: The space scene is removed in the redesign.
**Migration**: None. The hero sphere replaces the scene.

### Requirement: Space World
**Reason**: The galaxies, nebulae and sky are removed with the space journey.
**Migration**: None. The project sections carry their own decorative language lettering and mockups (see `project-showcase`).

### Requirement: On-Demand Rendering
**Reason**: Rendering was tied to scrolling through the whole page. Now only the hero has a 3D element.
**Migration**: See "Hero Sphere On-Demand Rendering".

### Requirement: Deferred and Conditional 3D Loading
**Reason**: The conditions change: reduced motion now gets a still sphere instead of no 3D, crawlers are excluded here, and project pages load no 3D.
**Migration**: See "Deferred Sphere Loading".
