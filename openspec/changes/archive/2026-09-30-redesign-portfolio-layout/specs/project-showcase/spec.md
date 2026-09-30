## ADDED Requirements

### Requirement: Project Sections
The home page SHALL present the six featured projects in featured order, each as a section of at least one viewport height. The text SHALL be on one side and the mockup on the other, alternating sides from project to project; on narrow screens the mockup SHALL come after the text. Each section SHALL show:
- an accent divider with the project's number (01–06)
- the title
- a one-sentence summary in the current language
- the language, year and, for team projects, a localized "Team · N" badge
- an accent-colored "View project" button with an angled corner, which opens the project's detail page
- the project's main programming language as large decorative outline lettering behind the mockup, hidden from assistive technology

The first section SHALL carry the section id used by the "Projects" navigation.

#### Scenario: User scrolls through the projects
- **WHEN** the user scrolls from the hero to the About section
- **THEN** six project sections follow each other in featured order, with text and mockup changing sides each time, and each section's divider, text and mockup reveal as it enters the view

#### Scenario: User opens a project
- **WHEN** the user activates "View project" in the Flashcards section
- **THEN** the Flashcards detail page opens in the current language

#### Scenario: Project sections on a phone
- **WHEN** the projects are viewed on a 390px wide screen
- **THEN** each section shows the text first and the mockup below, without horizontal overflow

### Requirement: Code Mockups
Each project SHALL have a stylized mockup built from real material of its repository, not from screenshots. The mockup SHALL be one of these frames:
- a laptop: web apps
- an application window with title bar: desktop apps
- a terminal: backends without a user interface

Each frame SHALL contain:
- an excerpt of the project's actual source code, or real command output for the terminal
- syntax highlighting in both color modes
- the file name or command in the frame's title bar

The highlighting SHALL be produced at build time, so the mockup is static HTML with no client-side highlighting code. The code SHALL be real text: selectable and hidden from screen readers only where it is duplicated. Each frame SHALL have an accessible label describing what it shows. The mockup SHALL animate in when revealed: the laptop lid opens, and windows and terminals rise in. With reduced motion, it SHALL simply appear.

#### Scenario: Visitor looks at the Crow Demo Backend
- **WHEN** the Crow Demo Backend section is shown
- **THEN** its mockup is a terminal showing a request to the backend's devices endpoint and the JSON the backend returns

#### Scenario: Visitor looks at Flashcards in light mode
- **WHEN** the Flashcards section is shown in light mode
- **THEN** its mockup is an application window with Java code from the repository, highlighted with the light-mode colors

#### Scenario: Visitor checks the source
- **WHEN** the visitor compares a mockup's code with the linked repository
- **THEN** the code appears in the named file of the repository (excerpted, with omissions marked)

### Requirement: Verified Project Data and Links
The system SHALL feature six of Jan Brunner's public GitHub projects: Driving Planner, Flashcards, 3D Vector Viewer, Crow Demo Backend, DrivingTracker and RPN Calculator. Their summaries, descriptions, feature lists, tech stacks and code excerpts SHALL be verified against each repository's README and source. The system SHALL NOT feature Prolog or the Prolog project. Featured projects MAY live in other GitHub accounts or organizations. In that case the project's repository link SHALL point to that repository and show a short repository label. Links to repositories and live sites SHALL open in a new tab with `rel="noopener noreferrer"`.

#### Scenario: User opens a project's repository
- **WHEN** the user activates the GitHub link on a project's detail page
- **THEN** the corresponding GitHub repository opens in a new tab with rel="noopener noreferrer"

#### Scenario: Project lives in an organization
- **WHEN** a featured project is hosted outside the profile, such as Flashcards in `2526-3bhif-syp` or Driving Planner in `2526-wmc-3bhif-classroom-org`
- **THEN** its repository link points to the full organization repository URL and shows a short repository label instead of the full organization path

#### Scenario: Project has a live site
- **WHEN** a project has a published site or documentation (e.g. DrivingTracker docs, Flashcards docs)
- **THEN** its detail page shows a separate "Live" link to that site

### Requirement: Skills and Timeline
The system SHALL show a Skills section after the more-repositories list. It SHALL contain:
- the milestones timeline
- the skill groups (Languages including SQL and PL/SQL, Frameworks, Data, Tooling), each as a labeled static list, as text only and without self-rated proficiency levels

On wide screens the timeline and the groups SHALL sit side by side, and on narrow screens one below the other. Each group SHALL be a list with an accessible name. Every skill SHALL be visible at once without horizontal movement.

#### Scenario: User views skills
- **WHEN** the Skills section is displayed
- **THEN** each group appears with its localized label and all of its skills in the current language, nothing moves sideways, and no horizontal page overflow occurs from 320px to 2560px wide

#### Scenario: Screen reader user reaches the skills
- **WHEN** a screen reader reads the Skills section
- **THEN** each group is announced as a list with its name, and each skill is read once

## MODIFIED Requirements

### Requirement: Live GitHub Statistics
The system SHALL show the following, fetched from the GitHub API and refreshed at most hourly:
- the public repository count, the Cloudflight contest result, the years of coding and the top languages, as a stats row in the About section
- the follower count in the contact section
- the repository count in the "All N repositories" link

The language ranking SHALL exclude Shell, HTML and Prolog. The system SHALL fall back to static values when the API is unavailable.

#### Scenario: GitHub API is reachable
- **WHEN** the page is rendered or revalidated
- **THEN** the About section shows the current repository count and three most used languages, and the contact section the current follower count

#### Scenario: GitHub API is unreachable or rate-limited
- **WHEN** the GitHub API request fails
- **THEN** the page still renders using the stored fallback values

## REMOVED Requirements

### Requirement: Project Cards
**Reason**: The featured projects are shown as full-height project sections with mockups, and in detail on their own pages, instead of as cards.
**Migration**: See "Project Sections", "Code Mockups" and the `project-pages` capability.

### Requirement: Constant-Speed Skills Marquee
**Reason**: The skills are shown as static lists in the calmer redesign.
**Migration**: See "Skills Overview".

### Requirement: Accessible Skills Marquee
**Reason**: There is no marquee anymore. The static lists are accessible by construction.
**Migration**: See "Skills Overview" (accessible group lists).

### Requirement: Real Project Data and Verified Links
**Reason**: Project cards no longer link straight to the repository. The repository links move to the detail pages, and verification now also covers feature lists and code excerpts.
**Migration**: See "Verified Project Data and Links".

### Requirement: Skills Overview
**Reason**: The marquee rows and journey chips are replaced by static lists next to the timeline.
**Migration**: See "Skills and Timeline".
