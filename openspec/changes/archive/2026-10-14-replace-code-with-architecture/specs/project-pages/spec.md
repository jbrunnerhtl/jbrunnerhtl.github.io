# Spec Delta

## MODIFIED Requirements

### Requirement: Project Page Content
Each project page SHALL show:
- **Header:** the project title as the page's only `<h1>`, an introduction, and links to the GitHub repository and, if there is one, the live site. Beside it, a list of facts: main language, year, team size or "Solo", and the tech stack.
- **Architecture:** the project's architecture diagram at full content width.
- **Sections:** at least "Features" (what the project does, as a list) and "How it's built" (architecture and notable technical decisions). All of it is written from the repository's README and source, in the current language.

The page SHALL NOT show excerpts of the project's source code. All text SHALL be real, selectable text.

#### Scenario: Visitor reads the Flashcards page
- **WHEN** the Flashcards page is displayed in English
- **THEN** it shows the title, the introduction, links to the organization repository and the documentation site, the facts (Java, 2026, Team · 4, the stack), the architecture diagram, and the "Features" and "How it's built" sections with content matching the repository

#### Scenario: Project page on a phone
- **WHEN** a project page is viewed on a 390px wide screen
- **THEN** the header, facts, diagram and sections stack in one column without horizontal overflow

#### Scenario: No code on a project page
- **WHEN** any project page is displayed
- **THEN** it contains no code excerpt and no "From the code" section
