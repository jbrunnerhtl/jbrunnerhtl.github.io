# portfolio-ui Specification

## Purpose
The site shell and presentation layer: light and dark color modes, readable contrast, reveal and scramble effects, native scrolling with section links, the sidebar and full-screen menu, bilingual pages (EN/DE), the hero title and count-up stats, contact options, the 404 page and the browser icon.

## Requirements

### Requirement: Readable Text Contrast
The system SHALL keep every text color token at a contrast ratio of at least 4.5:1 against the page background and surfaces, in both dark and light mode. This includes text on the accent-colored buttons.

#### Scenario: User reads small secondary text
- **WHEN** small labels such as section numbers, years, stat captions or the language pill are displayed in either mode
- **THEN** their contrast against the background is at least 4.5:1

#### Scenario: User reads a primary button
- **WHEN** an accent-colored "View project" button is displayed in either mode
- **THEN** its label has a contrast of at least 4.5:1 against the accent fill

### Requirement: Contact Options
The system SHALL end the home page with a contact section containing:
- a scrambling heading and a short text
- the contact email address with a mailto action and a copy-to-clipboard button
- an accent-colored mail button with an angled corner, and a link to the GitHub profile

A footer with the copyright, school and region SHALL follow.

#### Scenario: User copies the email address
- **WHEN** the user activates the copy button next to the email address
- **THEN** the address is copied, a confirmation icon appears and "Copied!" is announced to screen readers for about two seconds

### Requirement: Localized Not Found Page
The system SHALL respond to unknown URLs with a localized 404 page in the site's design, in the visitor's color mode, returning HTTP status 404 and marked noindex.

#### Scenario: Visitor opens a missing page
- **WHEN** a visitor requests an unknown path such as `/de/missing`, an unknown project such as `/en/projects/unknown/`, or an unsupported locale like `/fr`
- **THEN** a 404 page is shown in German for `/de/…` paths and in English otherwise, in the saved or system color mode, with a link back to that language's home page

### Requirement: Branded Browser Icon
The system SHALL use the GitHub profile picture as the browser tab icon and Apple touch icon.

#### Scenario: User views the site in a browser tab
- **WHEN** the site is open in a browser tab or saved to a phone's home screen
- **THEN** the round GitHub profile picture is shown as its icon

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

### Requirement: Reveal and Text Effects
The system SHALL reveal section content as it scrolls into view: dividers draw from left to right, and headings, text, buttons and mockups fade and rise in with a short stagger, each only once per page view. Selected headings SHALL build up with a scramble effect: random glyphs settle into the final text from left to right. These are the hero's cycling role, the About greeting and the contact heading. Server-rendered HTML and assistive technology SHALL always contain the final text. With reduced motion, all content SHALL be shown immediately and without scramble.

#### Scenario: Visitor scrolls to the About section
- **WHEN** the About section enters the viewport
- **THEN** the greeting scrambles into "Hi there" (or "Servus" in German), then the text, stats and link fade in one after another

#### Scenario: Screen reader reads a scrambling heading
- **WHEN** a screen reader reaches a heading while its scramble effect runs
- **THEN** it reads the final text, never the random glyphs

#### Scenario: Content without JavaScript
- **WHEN** the page is viewed without JavaScript
- **THEN** all sections and their content are visible in reading order

### Requirement: Native Scrolling With Section Links
The system SHALL use the browser's native scrolling. In-page navigation (sidebar links, the scroll indicator, "Send me a message") SHALL smooth-scroll to the target section, and SHALL jump instantly when the user prefers reduced motion. Links from a project page to a home section SHALL open the home page at that section.

#### Scenario: User selects a section in the sidebar
- **WHEN** the user selects "Skills" on the home page
- **THEN** the page scrolls smoothly to the Skills section and focus moves to its heading

#### Scenario: User selects a section from a project page
- **WHEN** the user selects "Contact" while on a project page
- **THEN** the home page opens scrolled to the Contact section

### Requirement: Sidebar Navigation and Responsive Layout
The system SHALL adapt layout and navigation to every viewport from 320px to 2560px wide without horizontal overflow, scaling the rem-based layout up gently on screens 1920px and wider. On touch devices, every navigation control SHALL have a touch target of at least 44×44px. The navigation SHALL be the same on the home page and the project pages.

#### Scenario: User navigates on a wide screen
- **WHEN** viewing on screens 1024px wide or larger
- **THEN** a fixed sidebar on the left shows:
  - the "JB" monogram linking to the top of the home page
  - the section links Projects, About, Skills and Contact, written vertically
  - the GitHub and email icons at the bottom

  The link of the section in view is highlighted with the accent color, and hovering or focusing a link draws an accent line along it. The theme toggle and language switch sit in the top right corner.

#### Scenario: User navigates on a narrow screen
- **WHEN** viewing on screens under 1024px
- **THEN** the monogram and a menu button are shown at the top. The button opens a full-screen menu with:
  - large, staggered section links
  - the GitHub and email links
  - the language switch and theme toggle

  The menu closes on selecting a link, pressing Escape, or growing past the breakpoint, and keeps focus inside while open.

#### Scenario: User taps the menu on a 320px phone
- **WHEN** the page is shown on a 320px wide screen
- **THEN** the top bar and the open menu fit without horizontal overflow, and all targets are at least 44×44px

### Requirement: Bilingual Pages
The system SHALL serve all copy in English and German, under `/en` and `/de`, for the home page and every project page. All pages SHALL be prerendered, with the correct `lang` attribute, title, description and Open Graph locale per language. Requests without a locale prefix SHALL redirect to the stored language choice, else the browser's preferred supported language, else English.

#### Scenario: Visitor opens the root URL
- **WHEN** a visitor requests `/`
- **THEN** they are redirected to `/de` or `/en` based on their saved choice, then their Accept-Language header, then English

#### Scenario: User switches language on the home page
- **WHEN** the user selects DE or EN in the navigation
- **THEN** the copy cross-fades to the other language in place without a reload, keeping the scroll position and the hero sphere, and the URL, `lang` attribute, title and saved choice are updated

#### Scenario: User switches language on a project page
- **WHEN** the user selects DE while reading `/en/projects/flashcards/`
- **THEN** the same project page is shown in German at `/de/projects/flashcards/`

### Requirement: Hero Title and Count-Up Stats
The system SHALL show a hero that fills the first viewport:
- **Name heading:** the name "Jan Brunner" as a small, letter-spaced, uppercase heading.
- **Role title:** a large role word followed by a thin horizontal line. Below it, a "+" with a second role that cycles about every 3 seconds through a localized list, each new role scrambling in.
- **Scroll indicator:** leads to the projects.
- **Entrance:** the name, role and line appear with a short staggered entrance animation, driven by CSS so it starts on first paint.
- **Count-up:** displayed counts SHALL count up from zero once visible.

#### Scenario: Page loads
- **WHEN** the home page is first painted
- **THEN** the name, the role and the line animate in without waiting for JavaScript, and nothing shifts when the sphere appears

#### Scenario: Role cycles
- **WHEN** the entrance has finished and the hero is visible
- **THEN** about every 3 seconds the second role changes to the next one in the list with a scramble effect, and the heading does not change size

#### Scenario: Role cycle and assistive technology
- **WHEN** a screen reader reads the hero, or the visitor prefers reduced motion
- **THEN** the role is read as a stable text (e.g. "Developer + Student"), and with reduced motion the role does not cycle

#### Scenario: Hero is off-screen
- **WHEN** the hero is scrolled out of view or the tab is hidden
- **THEN** no role changes are started until it is visible again

#### Scenario: Stats come into view
- **WHEN** the GitHub stats in the About section or the follower count scroll into view
- **THEN** each number counts up to its value without shifting the layout, the server-rendered HTML contains the final values, and the final values are shown immediately when reduced motion is preferred
