# search-engine-optimization Specification

## Purpose
Makes the portfolio easy for search engines to find, index and understand, and makes shared links show a proper preview: absolute URLs on the user site, language alternates, a preview image, sitemap and robots at the host root, structured data about the person and the projects, clean headings, search console verification and IndexNow notifications.

## Requirements

### Requirement: Site URL and Canonical Pages
The system SHALL know its public site URL at build time (the GitHub Pages URL by default, which for the `jbrunnerhtl.github.io` user site is the host root without a base path, overridable for a custom domain) and SHALL emit absolute URLs in all metadata. Each language page SHALL declare itself as canonical (`/en/` and `/de/`, with trailing slash) and SHALL set `og:url` and `og:site_name`. Local builds without a configured URL SHALL still build and use a localhost URL.

#### Scenario: Crawler reads the German page
- **WHEN** a crawler fetches `/de/` of the deployed site
- **THEN** the page declares `https://jbrunnerhtl.github.io/de/` as its canonical URL and `og:url`

#### Scenario: Site moves to a custom domain
- **WHEN** the site is built with a different site URL configured
- **THEN** every canonical, alternate, Open Graph, sitemap and structured-data URL uses that domain

### Requirement: Language Alternates
The English and German pages SHALL link to each other as language alternates (`hreflang="en"`, `hreflang="de"`), and both SHALL name the root language chooser `/` as `x-default`. The root page SHALL carry the same alternates.

#### Scenario: Search engine groups translations
- **WHEN** a search engine reads `/en/`
- **THEN** it finds alternates for `en` (`/en/`), `de` (`/de/`) and `x-default` (`/`), and `/de/` lists the same set

### Requirement: Link Preview Image
Each language SHALL have a 1200×630 preview image, used for Open Graph and as a large Twitter/X card by the home page and the project pages of that language. It SHALL:
- show the name and the page's role line in that language
- use the site's dark design: near-black background, the accent color, an accent divider and a soft sphere-like shape
- be generated at build time in code, with no downloaded image assets
- be served as a static file

#### Scenario: Link is shared in a messenger
- **WHEN** someone shares `/de/` or a German project page in a chat app or social network
- **THEN** the preview shows the page's title, description and the generated image with Jan Brunner's name

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

### Requirement: Search Console Verification
The system SHALL support optional search engine verification tokens set at build time, one for Google Search Console and one for Bing Webmaster Tools, each emitted as the matching verification meta tag on both language pages and on the root page `/`, which is the home page search consoles check. A token that is not configured SHALL NOT emit a tag.

#### Scenario: Owner verifies the site in Google Search Console
- **WHEN** the site is built with a Google verification token configured
- **THEN** the root page and both language pages contain the `google-site-verification` meta tag with that token

#### Scenario: Owner verifies the site in Bing Webmaster Tools
- **WHEN** the site is built with a Bing verification token configured
- **THEN** the root page and both language pages contain the `msvalidate.01` meta tag with that token

#### Scenario: No tokens configured
- **WHEN** the site is built without verification tokens
- **THEN** neither verification meta tag is present

### Requirement: Search Engine Change Notification
The system SHALL notify search engines that support IndexNow of the language pages after a deployment caused by a push to `main` or a manual run. It SHALL NOT notify after the daily scheduled rebuild, which only refreshes statistics. The site SHALL serve the IndexNow key file at the host root, so the notification can be verified. A failed notification SHALL NOT mark the deployment as failed.

#### Scenario: New content is pushed
- **WHEN** a push to `main` has been deployed
- **THEN** the IndexNow endpoint receives the URLs of `/en/` and `/de/` with the site's key and key location, and Bing picks up the change without waiting for its next crawl

#### Scenario: Daily rebuild
- **WHEN** the daily schedule has redeployed the site
- **THEN** no IndexNow notification is sent

#### Scenario: IndexNow is unreachable
- **WHEN** the IndexNow request fails or times out
- **THEN** the site is still deployed and the workflow run reports the failure only as a warning
