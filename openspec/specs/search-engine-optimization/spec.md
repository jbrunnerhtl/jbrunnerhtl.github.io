# search-engine-optimization Specification

## Purpose
Makes the portfolio easy for search engines to index and understand, and makes shared links show a proper preview: absolute URLs, language alternates, a preview image, sitemap and robots, structured data about the person, and clean heading text.

## Requirements

### Requirement: Site URL and Canonical Pages
The system SHALL know its public site URL at build time (the GitHub Pages URL including the base path by default, overridable for a custom domain) and SHALL emit absolute URLs in all metadata. Each language page SHALL declare itself as canonical (`/en/` and `/de/`, with trailing slash) and SHALL set `og:url` and `og:site_name`. Local builds without a configured URL SHALL still build and use a localhost URL.

#### Scenario: Crawler reads the German page
- **WHEN** a crawler fetches `/de/` of the deployed site
- **THEN** the page declares `https://jbrunnerhtl.github.io/personal-wesite3.0/de/` as its canonical URL and `og:url`

#### Scenario: Site moves to a custom domain
- **WHEN** the site is built with a different site URL configured
- **THEN** every canonical, alternate, Open Graph, sitemap and structured-data URL uses that domain

### Requirement: Language Alternates
The English and German pages SHALL link to each other as language alternates (`hreflang="en"`, `hreflang="de"`), and both SHALL name the root language chooser `/` as `x-default`. The root page SHALL carry the same alternates.

#### Scenario: Search engine groups translations
- **WHEN** a search engine reads `/en/`
- **THEN** it finds alternates for `en` (`/en/`), `de` (`/de/`) and `x-default` (`/`), and `/de/` lists the same set

### Requirement: Link Preview Image
Each language page SHALL have a 1200×630 preview image, used for Open Graph and as a large Twitter/X card. It SHALL show the name, the page's tagline in that language and the site's dark space look. It SHALL be generated at build time in code, with no downloaded image assets, and SHALL be served as a static file.

#### Scenario: Link is shared in a messenger
- **WHEN** someone shares `/de/` in a chat app or social network
- **THEN** the preview shows the German title, description and the generated image with Jan Brunner's name

### Requirement: Sitemap and Robots
The system SHALL publish a `sitemap.xml` that lists `/en/` and `/de/` with their language alternates and last-modified date, and a `robots.txt` that allows crawling and names the sitemap URL. The 404 page SHALL remain `noindex` and SHALL NOT be listed.

#### Scenario: Search console reads the sitemap
- **WHEN** the sitemap URL is submitted to a search console
- **THEN** it lists both language pages with absolute URLs and alternates, and nothing else

### Requirement: Structured Data
Each language page SHALL embed JSON-LD describing a `ProfilePage` whose main entity is a `Person` (name, GitHub handle as alternate name, page URL, GitHub profile in `sameAs`, school affiliation, region and country, and skills as `knowsAbout`), plus the `WebSite` with its name, URL and language. The data SHALL match the visible content and be valid for structured-data testing tools.

#### Scenario: Rich result test
- **WHEN** the German page is checked with a structured-data validator
- **THEN** it finds a valid `ProfilePage` with a `Person` named Jan Brunner, linked to the GitHub profile, and reports no errors

### Requirement: Clean Main Heading
The page's single `<h1>` SHALL contain the name exactly once as text ("Jan Brunner"), for search engines and screen readers alike. The animated name swap and its size placeholders SHALL remain purely visual and SHALL NOT add text to the heading.

#### Scenario: Crawler reads the heading
- **WHEN** the text content of the `<h1>` is read from the server-rendered HTML
- **THEN** it is "Jan Brunner" and nothing else, while the page still shows the animated name swap

### Requirement: Search Console Verification
The system SHALL support an optional search console verification token set at build time, emitted as the matching verification meta tag. Without a token, no verification tag SHALL be emitted.

#### Scenario: Owner verifies the site in Google Search Console
- **WHEN** the site is built with a Google verification token configured
- **THEN** both language pages contain the `google-site-verification` meta tag with that token
