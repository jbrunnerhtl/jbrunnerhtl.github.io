# portfolio-ui Specification

## Purpose
The site shell and presentation layer: design system and color modes, readable contrast, smooth scrolling, responsive navigation, bilingual content (EN/DE), hero entrance and count-up stats, contact options, the 404 page and the browser icon.

## Requirements

### Requirement: Dark Design System
The system SHALL style the site from color tokens in a single dark mode that fits the space scene. There SHALL be no color mode toggle and no light mode, and the page SHALL render dark from the first paint regardless of the operating system's color scheme. Solid, translucent surfaces SHALL be used instead of backdrop blur over the 3D canvas.

#### Scenario: User switches color mode
- **WHEN** the user looks for a color mode toggle in the navigation bar
- **THEN** there is none: the navigation bar shows the section links, the GitHub link and the language switch only

#### Scenario: Returning visitor loads the page
- **WHEN** a visitor whose operating system prefers a light color scheme opens the site
- **THEN** the page renders in the dark design from the first paint, without a flash of light colors

### Requirement: Readable Text Contrast
The system SHALL keep every text color token at a contrast ratio of at least 4.5:1 against both the page background and card surfaces.

#### Scenario: User reads small secondary text
- **WHEN** small labels such as stat captions, years or the language pill are displayed
- **THEN** their contrast against the background and cards is at least 4.5:1

### Requirement: Smooth Scrolling
The system SHALL provide smooth inertial scrolling with Lenis and smooth-scroll navigation to sections, and SHALL fall back to native scrolling when the user prefers reduced motion.

#### Scenario: User scrolls using mouse wheel or keyboard
- **WHEN** the user initiates a scroll
- **THEN** the page moves smoothly with momentum while keeping native scroll positions and keyboard navigation working

### Requirement: Responsive Navigation and Layout
The system SHALL adapt layout and navigation to every viewport from 320px to 2560px wide without horizontal overflow, scaling the rem-based layout up gently on screens 1920px and wider.

#### Scenario: User navigates on desktop
- **WHEN** viewing on screens 768px wide or larger
- **THEN** the navigation bar shows About, Projects, Skills and Contact, highlights the section in view with a sliding pill, and draws an underline from left to right on hover (on hover-capable devices) and on keyboard focus, which exits to the right on leave

#### Scenario: User navigates on mobile
- **WHEN** viewing on screens under 768px
- **THEN** a menu button opens a panel with the section links and GitHub link; it closes on selecting a link, tapping outside, pressing Escape, or growing past the breakpoint, and interactive targets are at least 40px

### Requirement: Bilingual Content
The system SHALL serve all copy in English and German at `/en` and `/de`, both prerendered, with the correct `lang` attribute, title, description and Open Graph locale per language. Requests without a locale prefix SHALL redirect to the stored language choice, else the browser's preferred supported language, else English.

#### Scenario: Visitor opens the root URL
- **WHEN** a visitor requests `/`
- **THEN** they are redirected to `/de` or `/en` based on their saved choice, then their Accept-Language header, then English

#### Scenario: User switches language
- **WHEN** the user selects DE or EN in the navigation bar
- **THEN** the copy cross-fades to the other language in place without a reload, keeping scroll position and the 3D scene, and the URL, `lang` attribute, title and saved choice are updated

### Requirement: Hero Entrance and Count-Up Stats
The system SHALL reveal the name in the hero with a CSS-only word animation that starts on first paint, SHALL afterwards alternate the hero name between "Jan Brunner." and the GitHub handle "JBrunnerhtl" at a regular interval with a staggered per-letter rise-out/rise-in transition, and SHALL count the hero stats and other displayed counts up from zero once visible.

#### Scenario: Page loads
- **WHEN** the home page is first painted
- **THEN** the words of the name rise into view without waiting for JavaScript, with gradient text moving together with its glyphs and no clipped letters

#### Scenario: Name alternates with the handle
- **WHEN** the entrance has finished and the hero is visible
- **THEN** about every 3.5 seconds the letters of the shown name leave upwards one after another while the other name rises in from below, the handle is styled like the name ("J" in the text color, "Brunnerhtl" in a continuous chrome gradient), and the heading does not change size

#### Scenario: Name alternation and assistive technology
- **WHEN** a screen reader reads the hero heading, or the visitor prefers reduced motion
- **THEN** the heading's accessible name is always "Jan Brunner", and with reduced motion the name stays "Jan Brunner." without alternating

#### Scenario: Hero is off-screen
- **WHEN** the hero heading is scrolled out of view or the tab is hidden
- **THEN** no name swaps are started until it is visible again

#### Scenario: Stats come into view
- **WHEN** the hero stats fade in, or the follower and repository counts scroll into view
- **THEN** each number counts up to its value without shifting the layout, the server-rendered HTML contains the final values, and the final values are shown immediately when reduced motion is preferred

### Requirement: Contact Options
The system SHALL show the contact email address with a mailto action and a copy-to-clipboard button, alongside a link to the GitHub profile.

#### Scenario: User copies the email address
- **WHEN** the user activates the copy button next to the email address
- **THEN** the address is copied, a confirmation icon appears and "Copied!" is announced to screen readers for about two seconds

### Requirement: Localized Not Found Page
The system SHALL respond to unknown URLs with a styled, localized 404 page in the site's dark design, returning HTTP status 404 and marked noindex.

#### Scenario: Visitor opens a missing page
- **WHEN** a visitor requests an unknown path such as `/de/missing` or an unsupported locale like `/fr`
- **THEN** a 404 page is shown in German for `/de/…` paths and in English otherwise, with a link back to that language's home page

### Requirement: Branded Browser Icon
The system SHALL use the GitHub profile picture as the browser tab icon and Apple touch icon.

#### Scenario: User views the site in a browser tab
- **WHEN** the site is open in a browser tab or saved to a phone's home screen
- **THEN** the round GitHub profile picture is shown as its icon
