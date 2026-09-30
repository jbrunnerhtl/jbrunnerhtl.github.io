# canvas-3d-experience Specification

## Purpose
The fixed 3D background: a liquid chrome orb that follows scroll and pointer, rendered only when needed and replaced by a static gradient where 3D would cost more than it adds.

## Requirements

### Requirement: Scroll-Driven Flight Through Space
The system SHALL move the camera along a straight route into the depth of space as a pure function of the smoothed scroll position, so the same scroll position always shows the same place and view. Scrolling down SHALL fly forward along the route, scrolling up SHALL fly back, and no scrolling SHALL mean no flight. The route SHALL pass one waypoint per station. The camera SHALL slow down while a station is being held, without ever stopping while the user scrolls, and glide faster between stations; the speed SHALL change smoothly between the two, without abrupt jumps. The camera SHALL look straight ahead along the route, with no turns or roll. The flight SHALL feel like calm gliding: no speed streaks and no field-of-view changes. The scene SHALL NOT be dimmed by a full-screen scrim, and the station content supplies its own readable surfaces.

#### Scenario: User scrolls through the page
- **WHEN** the user scrolls from the Hero to Contact
- **THEN** the camera travels straight ahead along the route, easing down at each station and gliding faster in between, never standing still while scrolling, with no turns, roll, sudden speed changes or stutter

#### Scenario: User scrolls back up
- **WHEN** the user scrolls up to a position they visited before
- **THEN** the camera flies back along the route and the scene matches what was shown at that position before

#### Scenario: User starts and stops scrolling
- **WHEN** the user starts scrolling after a pause and then stops
- **THEN** the camera accelerates and slows with the smoothed scroll, and the scene comes to rest without a jump once scrolling stops

#### Scenario: User jumps to a section from the navigation
- **WHEN** the user selects a section in the navbar and the page smooth-scrolls there
- **THEN** the camera flies the route through all stations in between in step with the scroll, without jumps or streak effects

#### Scenario: Viewport changes layout bucket
- **WHEN** a tablet is rotated or the window is resized across a layout boundary
- **THEN** the galaxies switch to that layout's size and placement

### Requirement: On-Demand Rendering
The system SHALL render the 3D scene only when it can change on screen: at full frame rate while the hero is visible on devices with a fine pointer, at full frame rate while the user scrolls or moves the pointer anywhere on the page (plus a short settle period), and not at all otherwise. On touch devices the hero SHALL follow the same rule as the rest of the page (rendering only during input plus the settle period), and phones SHALL render at a capped pixel density, to save battery and avoid heat. The scene's animation clock SHALL advance only on rendered frames, so pausing never causes a visible jump.

#### Scenario: User reads mid-page without interacting
- **WHEN** the hero is scrolled out of view and there has been no scroll or pointer input for the settle period
- **THEN** the canvas renders no frames and the page runs at the display's full frame rate

#### Scenario: User scrolls mid-page
- **WHEN** the user scrolls while the hero is out of view
- **THEN** the flight renders at the display's full frame rate, not at a reduced rate

#### Scenario: User resumes scrolling mid-page
- **WHEN** the user scrolls again after the scene was paused
- **THEN** rendering resumes from the frozen state without the stars, galaxies or camera jumping

#### Scenario: Phone rests at the hero
- **WHEN** the page is open on a touch device at the hero and there has been no input for the settle period
- **THEN** the canvas renders no frames until the user touches or scrolls again

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

### Requirement: Space World
The system SHALL render outer space around the route: a distant sky in every direction with faint stars and a soft nebula glow that turns with the view but never comes closer, nebula clouds placed along the route that the camera passes near or through, and one galaxy for every station after the hero (the stats, About, each project, the repository list, Skills, Contact). Each galaxy SHALL be made of thousands of glowing stars with a bright core, and each SHALL have its own colors and shape (spiral galaxies with two to four arms, a barred spiral at Skills, an elliptical galaxy at the repository list, a large destination galaxy at Contact). The galaxies SHALL turn slowly, the inner stars faster than the rim. They SHALL sit on alternating sides of the route so each is in view beside its station's content; on narrow layouts, where the content spans the screen width, a galaxy SHALL dim while its station's content is held over it and return to full brightness during the flight between stations. They SHALL appear only as the camera approaches them, and SHALL fade out stars right in front of the lens when the route passes through a galaxy's rim. All of it SHALL be generated in code with no downloaded textures or models.

#### Scenario: User arrives at the Skills station
- **WHEN** the Skills station is held
- **THEN** its galaxy is in view on the opposite side from the content, and it has different colors and shape from the one at the previous station

#### Scenario: User flies between stations
- **WHEN** the user scrolls from one station to the next
- **THEN** nebula clouds and stars pass by at different speeds, the next station's galaxy grows as it approaches, and the previous one falls behind

#### Scenario: User checks network requests
- **WHEN** the 3D scene loads
- **THEN** no image, texture or model files are downloaded for the space world

#### Scenario: Phone holds a station over its galaxy
- **WHEN** a station is held on a narrow layout and its galaxy lies behind the text
- **THEN** the galaxy is dimmed so the text stays easy to read, and it brightens again as the camera flies on to the next station
