## MODIFIED Requirements

### Requirement: Responsive Navigation and Layout
The system SHALL adapt layout and navigation to every viewport from 320px to 2560px wide without horizontal overflow, scaling the rem-based layout up gently on screens 1920px and wider. On touch devices, every control in the navigation bar (logo link, GitHub link, language switch, menu button) SHALL have a touch target of at least 44×44px.

#### Scenario: User navigates on desktop
- **WHEN** viewing on screens 768px wide or larger
- **THEN** the navigation bar shows About, Projects, Skills and Contact, highlights the section in view with a sliding pill, and draws an underline from left to right on hover (on hover-capable devices) and on keyboard focus, which exits to the right on leave

#### Scenario: User navigates on mobile
- **WHEN** viewing on screens under 768px
- **THEN** a menu button opens a panel with the section links and GitHub link; it closes on selecting a link, tapping outside, pressing Escape, or growing past the breakpoint, and interactive targets are at least 40px (44×44px on touch devices)

#### Scenario: User taps the language switch on a phone
- **WHEN** the user taps EN or DE in the navbar on a touch device
- **THEN** each option has a touch target of at least 44×44px, and the navbar still fits on a 320px wide screen without overflow
