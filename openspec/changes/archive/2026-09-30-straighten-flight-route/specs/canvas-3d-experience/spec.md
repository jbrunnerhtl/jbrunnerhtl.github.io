## MODIFIED Requirements

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
