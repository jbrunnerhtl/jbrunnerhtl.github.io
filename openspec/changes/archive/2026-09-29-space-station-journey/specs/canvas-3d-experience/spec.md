## RENAMED Requirements

- FROM: `### Requirement: Endless Particle Corridor`
- TO: `### Requirement: Starfield All Around`

## MODIFIED Requirements

### Requirement: GitHub Logo Companion
The system SHALL render a three-dimensional GitHub logo as a companion object in the fixed background layer behind the page content. The logo SHALL use the same mark as the site's GitHub icon, given depth, and a metallic, iridescent material lit by a procedural studio environment (no downloaded HDR map). The companion SHALL appear only at the start of the journey, beside the hero text, facing the viewer: while it rests there its idle sway and pointer lean SHALL stay within a limited angle, so it never turns edge-on. The companion is decoration only. It SHALL NOT capture pointer events, so it never blocks interaction with the content, and it SHALL NOT act as a link.

#### Scenario: User moves the pointer
- **WHEN** the user moves the mouse anywhere over the page
- **THEN** the logo leans gently towards the pointer on top of a slow idle sway, using frame-rate-independent damping, and stays readable face-on

#### Scenario: User scrolls away from the hero and back
- **WHEN** the user scrolls from the hero into the journey, and later scrolls back up to the hero
- **THEN** the logo flies off ahead into the distance, spinning and fading out, and is gone at the next station; scrolling back up flies it in again along the same path until it rests beside the hero text

#### Scenario: User clicks where the logo is drawn
- **WHEN** the user clicks or taps on the area where the companion is rendered
- **THEN** the click reaches the page content underneath, and no navigation to GitHub happens

#### Scenario: User switches color mode
- **WHEN** the operating system prefers a light color scheme
- **THEN** the environment lighting and the space world keep their single dark palette, since the site has no light mode

### Requirement: Scroll-Driven Flight Through Space
The system SHALL move the camera along a curved route through space as a pure function of the smoothed scroll position, so the same scroll position always shows the same place and view. Scrolling down SHALL fly forward along the route, scrolling up SHALL fly back, and no scrolling SHALL mean no flight. The route SHALL pass one waypoint per station. The camera SHALL slow down while a station is being held, without ever stopping while the user scrolls, and glide faster between stations; it SHALL look ahead along the route, turning smoothly with its curves. The flight SHALL feel like calm gliding: no speed streaks and no field-of-view changes. The companion's fly-off SHALL be a function of the route position too, so it plays backwards when scrolling up, and it SHALL trail slightly and bank gently while the flight speeds up. The scene SHALL NOT be dimmed by a full-screen scrim, and the station content supplies its own readable surfaces.

#### Scenario: User scrolls through the page
- **WHEN** the user scrolls from the Hero to Contact
- **THEN** the camera travels along the curved route, turning gently, slowing at each station and gliding faster in between, never standing still while scrolling, and without stutter

#### Scenario: User scrolls back up
- **WHEN** the user scrolls up to a position they visited before
- **THEN** the camera flies back along the route and the scene matches what was shown at that position before

#### Scenario: User starts and stops scrolling
- **WHEN** the user starts scrolling after a pause and then stops
- **THEN** near the hero the companion falls slightly behind and banks while the flight accelerates, then catches up and settles level once the flight stops

#### Scenario: User jumps to a section from the navigation
- **WHEN** the user selects a section in the navbar and the page smooth-scrolls there
- **THEN** the camera flies the route through all stations in between in step with the scroll, without jumps or streak effects

#### Scenario: Viewport changes layout bucket
- **WHEN** a tablet is rotated or the window is resized across a layout boundary
- **THEN** the companion and the galaxies switch to that layout's size and placement

### Requirement: Starfield All Around
The system SHALL surround the camera with stars in every direction, in several sizes and colours (white, blue-white and warm tones) and at several depths, so that nearer stars pass faster than distant ones. The stars SHALL twinkle gently while the scene renders. They SHALL be available along the whole route, never running out and in every direction the camera turns. Stars SHALL fade in from the distance and fade out before reaching the camera instead of popping in or out. The number of stars SHALL be reduced on mobile layouts.

#### Scenario: User reaches the bottom of a long page
- **WHEN** the user scrolls to the Contact station at the end of the route
- **THEN** the star density around the camera matches the density at the start

#### Scenario: Camera turns along the route
- **WHEN** the route curves
- **THEN** stars fill the new view direction just as densely, with no empty region

#### Scenario: Particles approach the camera
- **WHEN** a star comes close to the camera during the flight
- **THEN** it fades out smoothly before it would fill the view

#### Scenario: Page is viewed on a phone
- **WHEN** the page is opened on a mobile layout
- **THEN** the starfield uses fewer stars than on desktop while the flight still reads as continuous movement

## ADDED Requirements

### Requirement: Space World
The system SHALL render outer space around the route: a distant sky in every direction with faint stars and a soft nebula glow that turns with the view but never comes closer, nebula clouds placed along the route that the camera passes near or through, and one galaxy for every station after the hero (the stats, About, each project, the repository list, Skills, Contact). Each galaxy SHALL be made of thousands of glowing stars with a bright core, and each SHALL have its own colors and shape (spiral galaxies with two to four arms, a barred spiral at Skills, an elliptical galaxy at the repository list, a large destination galaxy at Contact). The galaxies SHALL turn slowly, the inner stars faster than the rim. They SHALL sit on alternating sides of the route so each is in view beside its station's content, SHALL appear only as the camera approaches them, and SHALL fade out stars right in front of the lens when the route passes through a galaxy's rim. All of it SHALL be generated in code with no downloaded textures or models.

#### Scenario: User arrives at the Skills station
- **WHEN** the Skills station is held
- **THEN** its galaxy is in view on the opposite side from the content, and it has different colors and shape from the one at the previous station

#### Scenario: User flies between stations
- **WHEN** the user scrolls from one station to the next
- **THEN** nebula clouds and stars pass by at different speeds, the next station's galaxy grows as it approaches, and the previous one falls behind

#### Scenario: User checks network requests
- **WHEN** the 3D scene loads
- **THEN** no image, texture or model files are downloaded for the space world
