# site-deployment Specification

## Purpose
How the static site is built and published to GitHub Pages: automated builds on push, daily and on demand, with least-privilege CI permissions and immutable action references to limit supply-chain risk.

## Requirements

### Requirement: Automated Static Deployment
The system SHALL build the static export and publish it to GitHub Pages on every push to `main`, once daily (to refresh GitHub statistics), and on manual dispatch, using the repository name as base path for project sites and no base path for `<user>.github.io` repositories. The build SHALL receive the public site URL (the Pages URL including any base path, unless a custom site URL is configured in the repository), so metadata, sitemap and structured data use absolute URLs.

#### Scenario: Push to main
- **WHEN** a commit is pushed to `main`
- **THEN** the site is type-checked, linted, built and deployed to GitHub Pages, and a failure in any step prevents deployment

#### Scenario: Daily refresh
- **WHEN** the daily schedule triggers
- **THEN** the site is rebuilt with current GitHub statistics and redeployed

#### Scenario: Build knows its public URL
- **WHEN** the workflow builds the site for the `jbrunnerhtl.github.io` repository without a custom site URL configured
- **THEN** the build uses no base path and `https://jbrunnerhtl.github.io` as site URL

### Requirement: Least-Privilege CI
The deployment workflow SHALL grant no permissions by default. Jobs that install dependencies or run project code SHALL have at most read access to repository contents and SHALL NOT persist git credentials. Only a separate deploy job, which runs no project or dependency code, SHALL hold Pages deployment permissions, and no job SHALL hold repository write access. Notifying search engines after a deployment SHALL happen in a job without any permissions that neither checks out nor runs repository code.

#### Scenario: Compromised dependency runs during build
- **WHEN** a dependency executes code during `npm ci` or `npm run build`
- **THEN** the only credentials available to it are read-only, and it cannot push commits, create branches or deploy

#### Scenario: Deploy job runs
- **WHEN** the deploy job publishes the uploaded artifact
- **THEN** it uses only `pages: write` and `id-token: write` and does not check out or execute repository code

#### Scenario: Search engines are notified
- **WHEN** the notification job sends the IndexNow request
- **THEN** it runs with no token permissions and without checking out the repository

### Requirement: Immutable Action References
The deployment workflow SHALL reference every third-party action by full commit SHA, and the repository SHALL have automated update proposals for pinned actions and npm dependencies.

#### Scenario: Action tag is moved upstream
- **WHEN** an upstream action's version tag is re-pointed to different code
- **THEN** the workflow keeps running the pinned commit until an update is reviewed and merged
