## MODIFIED Requirements

### Requirement: Real Project Data and Verified Links
The system SHALL feature six of Jan Brunner's public GitHub projects (Driving Planner, Flashcards, 3D Vector Viewer, Crow Demo Backend, DrivingTracker, RPN Calculator) with descriptions and tech stacks verified against each repository's source, and SHALL not feature Prolog or the Prolog project. Featured projects MAY live in other GitHub accounts or organizations, in which case the card SHALL link to that repository and show a short repository label.

#### Scenario: User opens a project
- **WHEN** the user clicks a project card
- **THEN** the corresponding GitHub repository opens in a new tab with rel="noopener noreferrer"

#### Scenario: Project lives in an organization
- **WHEN** a featured project is hosted outside the profile, such as Flashcards in `2526-3bhif-syp` or Driving Planner in `2526-wmc-3bhif-classroom-org`
- **THEN** its card links to the full organization repository URL and shows a short repository label instead of the full organization path

#### Scenario: Project has a live site
- **WHEN** a project has a published site or documentation (e.g. DrivingTracker docs, Flashcards docs)
- **THEN** its card shows a separate "Live" link to that site

### Requirement: Skills Overview
The system SHALL show skills in their groups (Languages including SQL and PL/SQL, Frameworks, Data, Tooling), as text only and without self-rated proficiency levels. In the stacked layout each group SHALL be one horizontally looping marquee row with a localized group label, adjacent rows moving in opposite directions, as purely decorative motion without hover, cursor or text-selection interaction. In journey mode the groups SHALL instead be shown side by side as static, wrapping chips, so every skill can be read at once.

#### Scenario: User views skills
- **WHEN** the Skills section is displayed in the stacked layout
- **THEN** each group appears as a labeled row of skill names in the current language, the rows loop continuously in alternating directions with faded edges, and no horizontal page overflow occurs from 320px to 2560px wide

#### Scenario: User views skills in the space journey
- **WHEN** the Skills station is held
- **THEN** each group appears with its label and all of its skills as glowing chips, nothing moves sideways and no skill is cut off


### Requirement: Project Cards
The system SHALL present featured projects as cards showing language (with GitHub's language color), year, title, description, stack tags and repository name. In the stacked layout the cards SHALL be in a grid that never overflows narrow screens. In journey mode each card SHALL be a station of its own in featured order, beside its own galaxy, shown as a hologram: a tinted, see-through surface with an edge and glow in the project's language color instead of a dark fill. The Projects heading and intro SHALL be shown with the first card. Team projects SHALL additionally show a localized "Team · N" badge with the number of team members.

#### Scenario: User hovers over a project card
- **WHEN** the pointer hovers a card on a hover-capable device
- **THEN** the card lifts slightly and tilts towards the pointer, a soft sheen follows the pointer and its border glows in the project's language color; on touch devices it responds with a subtle press instead of a sticky hover state, and with reduced motion it does not tilt

#### Scenario: Card shows a long repository name
- **WHEN** a repository name is too long for the card on a narrow screen
- **THEN** it is truncated with an ellipsis instead of widening the card

#### Scenario: Card shows a team project
- **WHEN** a featured project was built by a team, such as Flashcards (4 members) or Driving Planner (3 members)
- **THEN** the card shows a "Team · 4" or "Team · 3" badge in the current language, and solo projects show no badge

#### Scenario: Projects in journey mode
- **WHEN** journey mode is active, on any screen width
- **THEN** the six featured projects appear as six stations, one card each with its own galaxy, in featured order, with the Projects heading at the first station
