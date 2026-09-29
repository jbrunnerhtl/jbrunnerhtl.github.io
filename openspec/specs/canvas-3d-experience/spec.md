# canvas-3d-experience Specification

## Purpose
The fixed 3D background: a liquid chrome orb that follows scroll and pointer, rendered only when needed and replaced by a static gradient where 3D would cost more than it adds.

## Requirements

### Requirement: GitHub Logo Companion
The system SHALL render a three-dimensional GitHub logo as a companion object in the fixed background layer behind the page content. The logo SHALL use the same mark as the site's GitHub icon, given depth, and a metallic, iridescent material lit by a procedural studio environment (no downloaded HDR map). The companion SHALL keep its face turned towards the viewer: its idle sway and pointer lean SHALL stay within a limited angle, so it never turns edge-on. The companion is decoration only. It SHALL NOT capture pointer events, so it never blocks interaction with the content, and it SHALL NOT act as a link.

#### Scenario: User moves the pointer
- **WHEN** the user moves the mouse anywhere over the page
- **THEN** the logo leans gently towards the pointer on top of a slow idle sway, using frame-rate-independent damping, and stays readable face-on

#### Scenario: User clicks where the logo is drawn
- **WHEN** the user clicks or taps on the area where the companion is rendered
- **THEN** the click reaches the page content underneath, and no navigation to GitHub happens

#### Scenario: User switches color mode
- **WHEN** the resolved color mode changes between dark and light
- **THEN** the environment lighting and particle colors switch to that mode's palette and the environment map is re-baked

### Requirement: Scroll-Driven Flight Through Space
The system SHALL move the camera forward through the 3D space along its viewing direction in proportion to the smoothed scroll position over the whole page, so the same scroll position always shows the same place in space. Scrolling down SHALL fly forward, scrolling up SHALL fly back, and no scrolling SHALL mean no flight. The flight SHALL feel like calm gliding: no speed streaks and no field-of-view changes. The companion SHALL fly along with the camera, placed beside the text column along keyframed offsets with a separate choreography per layout (portrait/mobile, tablet/small laptop, desktop) chosen from the canvas size. It SHALL trail slightly behind when the flight speeds up, catch up when it slows down, and bank gently in the direction of travel. A scrim SHALL dim the scene past the hero only enough to keep text readable while the flight stays clearly visible.

#### Scenario: User scrolls through the page
- **WHEN** the user scrolls from the hero through About, Projects, Skills and Contact
- **THEN** the space moves steadily past the viewer the whole way down, without stutter, and the companion glides alongside without covering the text column

#### Scenario: User scrolls back up
- **WHEN** the user scrolls up to a position they visited before
- **THEN** the camera flies back and the scene matches what was shown at that position before

#### Scenario: User starts and stops scrolling
- **WHEN** the user starts scrolling after a pause and then stops
- **THEN** the companion falls slightly behind and banks while the flight accelerates, then catches up and settles level once the flight stops

#### Scenario: User jumps to a section from the navigation
- **WHEN** the user selects a section in the navbar and the page smooth-scrolls there
- **THEN** the camera glides the corresponding distance through space in step with the scroll, without jumps or streak effects

#### Scenario: Viewport changes layout bucket
- **WHEN** a tablet is rotated or the window is resized across a layout boundary
- **THEN** the companion switches to that layout's choreography (e.g. tucked into the top-right corner on tablets, beside the text column on wide desktops)

### Requirement: On-Demand Rendering
The system SHALL render the 3D scene only when it can change on screen: at full frame rate while the hero is visible, at full frame rate while the user scrolls or moves the pointer anywhere on the page (plus a short settle period), and not at all otherwise. The scene's animation clock SHALL advance only on rendered frames, so pausing never causes a visible jump.

#### Scenario: User reads mid-page without interacting
- **WHEN** the hero is scrolled out of view and there has been no scroll or pointer input for the settle period
- **THEN** the canvas renders no frames and the page runs at the display's full frame rate

#### Scenario: User scrolls mid-page
- **WHEN** the user scrolls while the hero is out of view
- **THEN** the flight renders at the display's full frame rate, not at a reduced rate

#### Scenario: User resumes scrolling mid-page
- **WHEN** the user scrolls again after the scene was paused
- **THEN** rendering resumes from the frozen state without the companion's pose or the particles jumping

### Requirement: Deferred and Conditional 3D Loading
The system SHALL load the 3D scene's code only after the browser is idle following the first render, and SHALL show a static gradient background instead of loading 3D at all when the user prefers reduced motion, has data saving enabled, the device reports 2 GB of memory or less or 2 CPU cores or fewer, or WebGL is unavailable. The device pixel ratio SHALL be capped at 1.5.

#### Scenario: Page loads on a capable device
- **WHEN** the page first loads
- **THEN** the initial JavaScript excludes three.js, and the canvas fades in over the same static gradient once the 3D code has loaded during idle time

#### Scenario: User prefers reduced motion
- **WHEN** the operating system's reduced-motion preference is enabled
- **THEN** no 3D code is downloaded and the static gradient background is shown

#### Scenario: Browser does not support WebGL
- **WHEN** WebGL initialization fails or is disabled
- **THEN** the static gradient background remains without throwing unhandled exceptions

### Requirement: Endless Particle Corridor
The system SHALL fill the space around the flight path with particles in several depth layers, so that nearer particles pass faster than distant ones. The particles SHALL be available along the entire flight: they never run out, however long the page is. Particles SHALL fade in from the distance and fade out before reaching the camera instead of popping in or out, and SHALL keep a clear area around the centre of the view so none pass directly through the middle of the screen. The number of particles SHALL be reduced on mobile layouts.

#### Scenario: User reaches the bottom of a long page
- **WHEN** the user scrolls to the Contact section at the end of the page
- **THEN** the particle density around the camera matches the density at the top of the page

#### Scenario: Particles approach the camera
- **WHEN** a particle comes close to the camera during the flight
- **THEN** it fades out smoothly before it would fill the view, and a new particle fades in from the distance

#### Scenario: Page is viewed on a phone
- **WHEN** the page is opened on a mobile layout
- **THEN** the corridor uses fewer particles than on desktop while the flight still reads as continuous movement
