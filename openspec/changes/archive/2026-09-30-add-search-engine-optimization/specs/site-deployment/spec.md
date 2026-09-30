## MODIFIED Requirements

### Requirement: Automated Static Deployment
The system SHALL build the static export and publish it to GitHub Pages on every push to `main`, once daily (to refresh GitHub statistics), and on manual dispatch, using the repository name as base path for project sites and no base path for `<user>.github.io` repositories. The build SHALL receive the public site URL (the Pages URL including the base path, unless a custom site URL is configured in the repository), so metadata, sitemap and structured data use absolute URLs.

#### Scenario: Push to main
- **WHEN** a commit is pushed to `main`
- **THEN** the site is type-checked, linted, built and deployed to GitHub Pages, and a failure in any step prevents deployment

#### Scenario: Daily refresh
- **WHEN** the daily schedule triggers
- **THEN** the site is rebuilt with current GitHub statistics and redeployed

#### Scenario: Build knows its public URL
- **WHEN** the workflow builds the site for the `personal-wesite3.0` repository without a custom site URL configured
- **THEN** the build uses `https://jbrunnerhtl.github.io/personal-wesite3.0` as site URL
