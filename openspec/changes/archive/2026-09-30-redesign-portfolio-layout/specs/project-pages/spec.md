## Purpose

A detail page for every featured project, in English and German. It gives each project its own address, room for features and background, and a clear way back to the rest of the portfolio.

## ADDED Requirements

### Requirement: Project Detail Routes
The system SHALL prerender one detail page per featured project and language at `/<lang>/projects/<slug>/`. The slugs are `driving-planner`, `flashcards`, `vector-viewer`, `crow`, `driving-tracker` and `rpn`. Unknown slugs SHALL show the 404 page. The pages SHALL use the same navigation, color mode and language switch as the home page.

#### Scenario: Visitor opens a project page directly
- **WHEN** a visitor opens `https://jbrunnerhtl.github.io/de/projects/crow/`
- **THEN** the Crow Demo Backend page is shown in German, fully rendered in the HTML, with the sidebar navigation

#### Scenario: Visitor opens an unknown project
- **WHEN** a visitor opens `/en/projects/unknown/`
- **THEN** the 404 page is shown

### Requirement: Project Page Content
Each project page SHALL show:
- **Header:** the project title as the page's only `<h1>`, an introduction, and links to the GitHub repository and, if there is one, the live site. Beside it, a list of facts: main language, year, team size or "Solo", and the tech stack.
- **Mockup:** the project's code mockup at full content width.
- **Sections:** at least "Features" (what the project does, as a list) and "How it's built" (architecture and notable technical decisions). All of it is written from the repository's README and source, in the current language.
- **Detail snippet:** at least one further code excerpt from the repository, with its file name, where it illustrates a point in the text.

All text SHALL be real, selectable text.

#### Scenario: Visitor reads the Flashcards page
- **WHEN** the Flashcards page is displayed in English
- **THEN** it shows the title, the introduction, links to the organization repository and the documentation site, the facts (Java, 2026, Team · 4, the stack), the mockup, and the "Features" and "How it's built" sections with content matching the repository

#### Scenario: Project page on a phone
- **WHEN** a project page is viewed on a 390px wide screen
- **THEN** the header, facts, mockup and sections stack in one column without horizontal overflow, and long code lines scroll inside their frame

### Requirement: Project Navigation
Each project page SHALL end with a link to the next project in featured order (the last one leads to the first), showing its number and title, and a link back to the projects on the home page. Page changes between the home page and project pages SHALL use a short fade transition and SHALL start at the top of the new page. Returning to the home page with the browser's back button SHALL restore the previous scroll position.

#### Scenario: Visitor goes to the next project
- **WHEN** the visitor activates the next-project link at the end of the RPN Calculator page
- **THEN** the Driving Planner page opens at its top

#### Scenario: Visitor goes back
- **WHEN** the visitor opened a project from its section on the home page and then presses the browser's back button
- **THEN** the home page is shown at the same project section

### Requirement: Project Page Metadata
Each project page SHALL have:
- a localized title of the form "<Project> — Jan Brunner" and a description based on its introduction
- an absolute canonical URL with trailing slash
- `hreflang` alternates for its English and German version
- Open Graph and Twitter metadata using the language's preview image
- JSON-LD describing the project as `SoftwareSourceCode`, with the person as author and the page as its URL

#### Scenario: Crawler reads a project page
- **WHEN** a crawler fetches `/en/projects/rpn/`
- **THEN** it finds the title "RPN Calculator — Jan Brunner", the canonical `https://jbrunnerhtl.github.io/en/projects/rpn/`, alternates for `en` and `de`, and valid `SoftwareSourceCode` JSON-LD for RPN Calculator
