## MODIFIED Requirements

### Requirement: Site URL and Canonical Pages
The system SHALL know its public site URL at build time (the GitHub Pages URL by default, which for the `jbrunnerhtl.github.io` user site is the host root without a base path, overridable for a custom domain) and SHALL emit absolute URLs in all metadata. Each language page SHALL declare itself as canonical (`/en/` and `/de/`, with trailing slash) and SHALL set `og:url` and `og:site_name`. Local builds without a configured URL SHALL still build and use a localhost URL.

#### Scenario: Crawler reads the German page
- **WHEN** a crawler fetches `/de/` of the deployed site
- **THEN** the page declares `https://jbrunnerhtl.github.io/de/` as its canonical URL and `og:url`

#### Scenario: Site moves to a custom domain
- **WHEN** the site is built with a different site URL configured
- **THEN** every canonical, alternate, Open Graph, sitemap and structured-data URL uses that domain

### Requirement: Sitemap and Robots
The system SHALL publish a `sitemap.xml` that lists `/en/` and `/de/` with their language alternates and last-modified date, and a `robots.txt` that allows crawling and names the sitemap URL. Both SHALL be served at the root of the host, so crawlers find the sitemap through `robots.txt` without it being submitted by hand. The 404 page SHALL remain `noindex` and SHALL NOT be listed.

#### Scenario: Search console reads the sitemap
- **WHEN** the sitemap URL is submitted to a search console
- **THEN** it lists both language pages with absolute URLs and alternates, and nothing else

#### Scenario: Crawler discovers the sitemap on its own
- **WHEN** a crawler requests `https://jbrunnerhtl.github.io/robots.txt`
- **THEN** it gets HTTP 200, crawling is allowed, and the file names `https://jbrunnerhtl.github.io/sitemap.xml`

### Requirement: Structured Data
Each language page SHALL embed JSON-LD describing a `ProfilePage` whose main entity is a `Person`, plus the `WebSite` with its name, URL and language, and the featured projects.
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
  - its name and description in the page's language
  - its repository URL
  - its programming language
  - the person as author
- The data SHALL match the visible content and be valid for structured-data testing tools. The email address SHALL NOT be included.

#### Scenario: Rich result test
- **WHEN** the German page is checked with a structured-data validator
- **THEN** it finds a valid `ProfilePage` with a `Person` named Jan Brunner, with an image and job title, linked to the GitHub profile, and reports no errors

#### Scenario: Search for a project name
- **WHEN** a search engine reads the structured data of `/en/`
- **THEN** it finds the six featured projects as `SoftwareSourceCode` with their English names and descriptions, each linking to its repository and naming Jan Brunner as author

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

## ADDED Requirements

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
