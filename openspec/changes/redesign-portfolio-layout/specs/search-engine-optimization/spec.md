## MODIFIED Requirements

### Requirement: Sitemap and Robots
The system SHALL publish a `sitemap.xml` that lists, with their language alternates and last-modified date:
- the language home pages `/en/` and `/de/`
- every project page (`/<lang>/projects/<slug>/`)

It SHALL also publish a `robots.txt` that allows crawling and names the sitemap URL. Both SHALL be served at the root of the host, so crawlers find the sitemap through `robots.txt` without it being submitted by hand. The 404 page SHALL remain `noindex` and SHALL NOT be listed.

#### Scenario: Search console reads the sitemap
- **WHEN** the sitemap URL is submitted to a search console
- **THEN** it lists both language home pages and the twelve project pages with absolute URLs and alternates, and nothing else

#### Scenario: Crawler discovers the sitemap on its own
- **WHEN** a crawler requests `https://jbrunnerhtl.github.io/robots.txt`
- **THEN** it gets HTTP 200, crawling is allowed, and the file names `https://jbrunnerhtl.github.io/sitemap.xml`

### Requirement: Structured Data
Each language home page SHALL embed JSON-LD describing a `ProfilePage` whose main entity is a `Person`, plus the `WebSite` with its name, URL and language, and the featured projects.
- The `ProfilePage` SHALL carry the date the page was last modified.
- The `Person` SHALL carry:
  - name, given name and family name
  - the GitHub handle as alternate name
  - a job title in the page's language
  - the profile picture as an absolute image URL
  - the page URL, and the GitHub profile in `sameAs`
  - the school affiliation with the school's website
  - region and country
  - skills as `knowsAbout`
- Each featured project SHALL be described as `SoftwareSourceCode` with:
  - its name and summary in the page's language
  - its detail page in that language as URL
  - its repository URL
  - its programming language
  - the person as author
- The data SHALL match the visible content and be valid for structured-data testing tools. The email address SHALL NOT be included.

#### Scenario: Rich result test
- **WHEN** the German page is checked with a structured-data validator
- **THEN** it finds a valid `ProfilePage` with a `Person` named Jan Brunner, with an image and job title, linked to the GitHub profile, and reports no errors

#### Scenario: Search for a project name
- **WHEN** a search engine reads the structured data of `/en/`
- **THEN** it finds the six featured projects as `SoftwareSourceCode` with their English names and summaries, each linking to its English detail page and its repository and naming Jan Brunner as author

### Requirement: Link Preview Image
Each language SHALL have a 1200×630 preview image, used for Open Graph and as a large Twitter/X card by the home page and the project pages of that language. It SHALL:
- show the name and the page's role line in that language
- use the site's dark design: near-black background, the accent color, an accent divider and a soft sphere-like shape
- be generated at build time in code, with no downloaded image assets
- be served as a static file

#### Scenario: Link is shared in a messenger
- **WHEN** someone shares `/de/` or a German project page in a chat app or social network
- **THEN** the preview shows the page's title, description and the generated image with Jan Brunner's name

### Requirement: Clean Main Heading
Every page SHALL have exactly one `<h1>`:
- on the home pages, it SHALL contain the name exactly once as text ("Jan Brunner")
- on project pages, the project title

Animated effects (the cycling role, scramble effects) SHALL NOT add random or duplicated text to headings in the server-rendered HTML or for assistive technology.

#### Scenario: Crawler reads the heading
- **WHEN** the text content of the `<h1>` of `/en/` is read from the server-rendered HTML
- **THEN** it is "Jan Brunner" and nothing else, while the page still shows the animated role title

#### Scenario: Crawler reads a project heading
- **WHEN** the `<h1>` of `/de/projects/rpn/` is read from the server-rendered HTML
- **THEN** it is the project title "RPN-Rechner"
