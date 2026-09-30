## MODIFIED Requirements

### Requirement: Journey Mode and Stacked Fallback
The system SHALL enable journey mode only in a browser with JavaScript where the 3D scene will be shown (no reduced-motion preference, no data saving, not a low-end device, WebGL available) and that is not a known search engine or link-preview crawler. Otherwise the page SHALL keep the stacked layout: sections one below the other in normal document flow, with the static gradient background. The server-rendered HTML SHALL be the stacked layout, so the page works without JavaScript.

#### Scenario: Visitor prefers reduced motion
- **WHEN** the operating system's reduced-motion preference is enabled
- **THEN** the page shows the stacked layout with all sections in normal flow and no station transitions

#### Scenario: Browser without WebGL
- **WHEN** WebGL is unavailable
- **THEN** the stacked layout is shown and no content is left hidden or transformed

#### Scenario: Journey mode starts after load
- **WHEN** journey mode switches on after hydration at the top of the page
- **THEN** the Hero station is shown at its hold state without a visible jump

#### Scenario: Search engine renders the page
- **WHEN** a crawler such as Googlebot or Bingbot renders the page with JavaScript
- **THEN** it gets the stacked layout with all content visible in normal flow, and the 3D scene is not loaded
