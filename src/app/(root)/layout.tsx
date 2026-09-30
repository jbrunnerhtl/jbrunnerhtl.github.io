import type { Metadata } from "next";
import "../globals.css";
import { fontClasses } from "../fonts";
import { LOCALES } from "@/i18n/config";
import { SITE_URL, siteUrl, siteVerification } from "@/lib/site";

// Separate root layout for "/" only: it just forwards to /en/ or /de/ (see page.tsx).
// For search engines it is the x-default of the two language pages, and the home page on which
// search consoles look for their verification tags.
export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Jan Brunner",
  description: "Portfolio of Jan Brunner, HTL Leonding.",
  alternates: {
    canonical: siteUrl(),
    languages: Object.fromEntries([...LOCALES.map((l) => [l, siteUrl(l)]), ["x-default", siteUrl()]]),
  },
  verification: siteVerification(),
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="min-h-full bg-bg font-sans text-fg">{children}</body>
    </html>
  );
}
