import type { Metadata } from "next";
import "../globals.css";
import { fontClasses } from "../fonts";

// Separate root layout for "/" only: it just forwards to /en/ or /de/ (see page.tsx).
export const metadata: Metadata = {
  title: "Jan Brunner",
  description: "Portfolio of Jan Brunner, HTL Leonding.",
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClasses}>
      <body className="min-h-full bg-bg font-sans text-fg">{children}</body>
    </html>
  );
}
