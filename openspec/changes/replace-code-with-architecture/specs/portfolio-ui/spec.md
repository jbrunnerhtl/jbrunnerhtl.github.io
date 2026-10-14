# Spec Delta

## MODIFIED Requirements

### Requirement: Reveal and Text Effects
The system SHALL reveal section content as it scrolls into view: dividers draw from left to right, and headings, text, buttons and architecture diagrams fade and rise in with a short stagger, each only once per page view. Selected headings SHALL build up with a scramble effect: random glyphs settle into the final text from left to right. These are the hero's cycling role, the About greeting and the contact heading. Server-rendered HTML and assistive technology SHALL always contain the final text. With reduced motion, all content SHALL be shown immediately and without scramble.

#### Scenario: Visitor scrolls to the About section
- **WHEN** the About section enters the viewport
- **THEN** the greeting scrambles into "Hi there" (or "Servus" in German), then the text, stats and link fade in one after another

#### Scenario: Screen reader reads a scrambling heading
- **WHEN** a screen reader reaches a heading while its scramble effect runs
- **THEN** it reads the final text, never the random glyphs

#### Scenario: Content without JavaScript
- **WHEN** the page is viewed without JavaScript
- **THEN** all sections and their content are visible in reading order

#### Scenario: Visitor scrolls to a project diagram
- **WHEN** a project's architecture diagram enters the viewport
- **THEN** it fades and rises in like the text beside it, without any device or lid animation
