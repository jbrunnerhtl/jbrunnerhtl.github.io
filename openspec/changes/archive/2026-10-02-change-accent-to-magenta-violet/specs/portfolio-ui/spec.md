# Spec Delta

## MODIFIED Requirements

### Requirement: Light and Dark Color Modes
The system SHALL style the site from color tokens in a dark and a light mode, with one accent hue used for highlights, numbers, dividers and primary buttons.
- **Accent tones:** the accent SHALL be a dark, magenta-leaning violet. Primary buttons SHALL use it as their fill in both modes. Highlights, numbers, dividers and other accent lines SHALL use a tone of the same hue that is clearly visible on the mode's background; in dark mode this is a lighter tone than the button fill.
- **First visit:** the mode SHALL follow the operating system's color scheme.
- **Toggle:** a toggle in the top right corner (in the full-screen menu on narrow screens) SHALL switch modes with a short cross-fade. The choice SHALL be saved and take precedence on later visits.
- **First paint:** the saved or system mode SHALL be applied before the first paint on every page, including the 404 page, so there is never a flash of the other mode.
- **Surfaces:** solid surfaces, no backdrop blur.

#### Scenario: First visit with a light system theme
- **WHEN** a visitor whose operating system prefers a light color scheme opens the site for the first time
- **THEN** the page renders in light mode from the first paint

#### Scenario: Visitor toggles the mode
- **WHEN** the visitor activates the toggle in dark mode
- **THEN** the page cross-fades to light mode, the toggle's icon and accessible label change, and the next visit opens in light mode even if the system prefers dark

#### Scenario: Reduced motion
- **WHEN** the visitor prefers reduced motion and toggles the mode
- **THEN** the mode changes instantly without a cross-fade

#### Scenario: Visitor views accent elements in dark mode
- **WHEN** a section with a divider, a section number and a primary button is displayed in dark mode
- **THEN** the button is filled with the dark magenta-violet and carries a light label, and the divider and the number use the lighter magenta tone and are clearly visible against the dark background

#### Scenario: Visitor views accent elements in light mode
- **WHEN** the same section is displayed in light mode
- **THEN** the button, the divider and the number all use the dark magenta-violet
