This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

`.github/workflows/deploy.yml` builds the static export and publishes it to GitHub Pages on every push to `main`, daily (to refresh the GitHub stats) and on manual dispatch.

One-time setup: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**. The workflow uses the official Pages artifact flow, so no `gh-pages` branch is needed.

The repository is named `jbrunnerhtl.github.io`, so it is the GitHub **user site** and is served from the host root, `https://jbrunnerhtl.github.io/`, without a base path. Under any other repository name the workflow builds a project site under `/<repo>/`. The repository variable `SITE_URL` overrides the public URL, for example for a custom domain.

## Search engines

- **Sitemap and robots:** `robots.txt` and `sitemap.xml` are at the host root. Crawlers find the sitemap on their own.
- **Verification (optional repository variables):**
  - `GOOGLE_SITE_VERIFICATION`: the token of the HTML-tag method for the Google Search Console URL-prefix property `https://jbrunnerhtl.github.io/`.
  - `BING_SITE_VERIFICATION`: the `msvalidate.01` token from Bing Webmaster Tools. It isn't needed when the site is imported from Google Search Console.

  Both tags are emitted on `/`, `/en/` and `/de/`. Re-run the workflow after setting a variable.
- **IndexNow:**
  - After every deployment from a push or a manual run, the `notify` job sends `/en/` and `/de/` to IndexNow. That reaches Bing (and with it DuckDuckGo, Ecosia and Yahoo), Yandex, Seznam and Naver.
  - The daily rebuild doesn't notify.
  - The key is `INDEXNOW_KEY` in the workflow, and the site serves it as `public/<key>.txt`. To change the key, change both. The build fails if they don't match.
  - A failed notification only shows as a warning.
- **Google** doesn't use IndexNow. Submit `sitemap.xml` in Search Console once and request indexing for `/en/` and `/de/`.
