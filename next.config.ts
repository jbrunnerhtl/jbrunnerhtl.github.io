import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (out/), published as a GitHub Pages artifact by .github/workflows/deploy.yml.
  output: "export",
  // Emit /en/index.html instead of /en.html, which static hosts like GitHub Pages serve directly.
  trailingSlash: true,
  // Empty on the jbrunnerhtl.github.io user site and locally; "/<repo>" if built as a project site.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  experimental: {
    // Root layouts live under app/[lang] and app/(root), so unmatched URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
};

export default nextConfig;
