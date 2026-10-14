# Spec Delta

## MODIFIED Requirements

### Requirement: Project Sections
The home page SHALL present the six featured projects in featured order, each as a section of at least one viewport height. The text SHALL be on one side and the project's architecture diagram on the other, alternating sides from project to project; on narrow screens the diagram SHALL come after the text. Each section SHALL show:
- an accent divider with the project's number (01–06)
- the title
- a one-sentence summary in the current language
- the language, year and, for team projects, a localized "Team · N" badge
- an accent-colored "View project" button with an angled corner, which opens the project's detail page
- the project's main programming language as large decorative outline lettering behind the diagram, hidden from assistive technology

The first section SHALL carry the section id used by the "Projects" navigation.

#### Scenario: User scrolls through the projects
- **WHEN** the user scrolls from the hero to the About section
- **THEN** six project sections follow each other in featured order, with text and diagram changing sides each time, and each section's divider, text and diagram reveal as it enters the view

#### Scenario: User opens a project
- **WHEN** the user activates "View project" in the Flashcards section
- **THEN** the Flashcards detail page opens in the current language

#### Scenario: Project sections on a phone
- **WHEN** the projects are viewed on a 390px wide screen
- **THEN** each section shows the text first and the diagram below, without horizontal overflow

#### Scenario: No project code on the home page
- **WHEN** the home page is displayed
- **THEN** no project shows an excerpt of its source code or command output

### Requirement: Verified Project Data and Links
The system SHALL feature six of Jan Brunner's public GitHub projects: Driving Planner, Flashcards, 3D Vector Viewer, Crow Demo Backend, DrivingTracker and RPN Calculator. Their summaries, descriptions, feature lists, tech stacks and architecture diagrams SHALL be verified against each repository's README and source. The system SHALL NOT feature Prolog or the Prolog project. Featured projects MAY live in other GitHub accounts or organizations. In that case the project's repository link SHALL point to that repository and show a short repository label. Links to repositories and live sites SHALL open in a new tab with `rel="noopener noreferrer"`.

#### Scenario: User opens a project's repository
- **WHEN** the user activates the GitHub link on a project's detail page
- **THEN** the corresponding GitHub repository opens in a new tab with rel="noopener noreferrer"

#### Scenario: Project lives in an organization
- **WHEN** a featured project is hosted outside the profile, such as Flashcards in `2526-3bhif-syp` or Driving Planner in `2526-wmc-3bhif-classroom-org`
- **THEN** its repository link points to the full organization repository URL and shows a short repository label instead of the full organization path

#### Scenario: Project has a live site
- **WHEN** a project has a published site or documentation (e.g. DrivingTracker docs, Flashcards docs)
- **THEN** its detail page shows a separate "Live" link to that site

## REMOVED Requirements

### Requirement: Code Mockups
**Reason**: The owner no longer wants project code on the site. Code excerpts in device frames said little about the projects, and the laptop animation looked cheap. Architecture diagrams show how each project is built.
**Migration**: Each project's mockup is replaced by its architecture diagram (capability `architecture-diagrams`). The code excerpts, their highlighting and the device frames are removed without replacement.
