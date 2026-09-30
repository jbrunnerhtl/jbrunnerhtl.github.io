## MODIFIED Requirements

### Requirement: Tall Station Content
When a station's content is taller than the viewport (for example a long project card on a short phone screen), the system SHALL move that content upwards through the viewport during the hold phase in step with scrolling, so all of it can be read before the station leaves. Station content SHALL fade out softly as it moves under the fixed navbar and towards the bottom edge of the screen, so it never shows through or above the navbar and never ends at a hard cut.

#### Scenario: Long content on a small screen
- **WHEN** the user holds at a station whose content is taller than the viewport
- **THEN** further scrolling first reveals the rest of the content from top to bottom, and only then does the station leave

#### Scenario: Content scrolls under the navbar
- **WHEN** a tall station's content moves up during the hold and reaches the navbar
- **THEN** the text fades out below the navbar and no text is visible behind or above the navbar

#### Scenario: Content is short enough to fit
- **WHEN** a station's content fits in the viewport and is held
- **THEN** none of its text is faded, and it is fully readable

## ADDED Requirements

### Requirement: Stable Journey on Mobile Browsers
The journey SHALL NOT rebuild its timeline or move the scroll position when only the visible height of a mobile browser changes (the address bar or toolbar showing or hiding while scrolling), so a touch swipe keeps its momentum and the stations do not jump. When the viewport width changes (device rotation, window resize), the journey SHALL rebuild and keep the user at the same place in the journey. Touch scrolling SHALL use the browser's native momentum scrolling.

#### Scenario: Address bar hides while swiping
- **WHEN** the user swipes up on a phone and the browser's address bar collapses
- **THEN** the scroll continues smoothly with its momentum, and the station shown does not jump or restart its transition

#### Scenario: User rotates the phone
- **WHEN** the user rotates the phone from portrait to landscape while a project station is held
- **THEN** the journey is laid out for the new size and the same project station is held afterwards

### Requirement: Compact Stations on Short Screens
On short viewports (below about 500px of height, for example phones in landscape), the journey SHALL use a compact layout: less spacing around the station content, a smaller hero heading and spacing, and less room reserved under the navbar, so the hero fits on screen and other stations overflow as little as possible. Content that still does not fit SHALL scroll through during the hold as for any tall station.

#### Scenario: Phone in landscape opens the page
- **WHEN** the page is opened on a phone in landscape (about 750×340)
- **THEN** the hero's name, text and buttons are visible without scrolling, and nothing is cut off by the screen edge

#### Scenario: Landscape reaches a long station
- **WHEN** the user scrolls to a project station in landscape
- **THEN** the content is readable, fades under the navbar as it scrolls through, and the station leaves only after its end has been shown
