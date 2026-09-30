## MODIFIED Requirements

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
