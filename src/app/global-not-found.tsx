import type React from "react";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import "./globals.css";
import { fontClasses } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import GithubIcon from "@/components/icons/GithubIcon";
import Monogram from "@/components/navigation/Monogram";
import { BASE_PATH, localePath } from "@/lib/basePath";
import { LOCALES, type Locale } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { de } from "@/i18n/dictionaries/de";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

// Exported as a single static 404.html (GitHub Pages serves it for every missing path), so it can't
// know the locale at build time. It renders both languages and this script, run before paint,
// picks one from the URL (/de/… → German, otherwise English) via <html lang>. The title is
// language-neutral, since Next re-applies metadata on hydration and would undo a scripted title.
const DICTS: Record<Locale, typeof en> = { en, de };
const LOCALE_SCRIPT = `(function(){var p=location.pathname.slice(${JSON.stringify(BASE_PATH)}.length).split("/")[1];if(p==="de")document.documentElement.lang="de"})()`;

export const metadata: Metadata = { title: `404 — ${PORTFOLIO_DATA.profile.name}` };

function NotFoundContent({ lang }: { lang: Locale }) {
  const t = DICTS[lang];
  const d = (s: number) => ({ "--delay": `${s}s` }) as React.CSSProperties;
  return (
    <div data-locale={lang}>
      {/* Static (no reveal script on this page); the CSS entrance runs on first paint. */}
      <div className="hero-in flex items-center gap-4" style={d(0.05)}>
        <span aria-hidden className="section-divider" />
        <span className="font-mono text-sm tracking-wider text-accent-text">404</span>
      </div>
      <h1 className="hero-in mt-8 text-[clamp(2.75rem,8vw,6rem)] font-medium leading-[1.02] tracking-[-0.035em] text-fg" style={d(0.15)}>
        {t.notFound.heading}
      </h1>
      <p className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-muted" style={d(0.3)}>
        {t.notFound.text}
      </p>
      <div className="hero-in mt-12 flex flex-wrap items-center gap-x-8 gap-y-6" style={d(0.45)}>
        <a href={localePath(lang)} className="btn-accent">
          <ArrowLeft aria-hidden className="h-5 w-5" /> {t.notFound.back}
        </a>
        <a href={PORTFOLIO_DATA.profile.githubUrl} className="inline-flex items-center gap-2 text-lg font-medium text-fg transition-colors hover:text-accent-text">
          <GithubIcon className="h-5 w-5" /> GitHub
        </a>
      </div>
    </div>
  );
}

export default function GlobalNotFound() {
  return (
    // The locale script sets <html lang> before paint, so the server value may differ.
    <html lang="en" className={fontClasses} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_SCRIPT }} />
      </head>
      <body className="isolate min-h-full bg-bg font-sans text-fg">
        <main className="relative mx-auto flex min-h-[100svh] max-w-[88rem] flex-col items-start justify-center px-6 py-24 sm:px-10 lg:px-16">
          <a
            href={`${BASE_PATH}/`}
            aria-label={PORTFOLIO_DATA.profile.name}
            className="absolute left-6 top-[max(1.5rem,env(safe-area-inset-top))] grid min-h-11 min-w-11 place-items-center text-fg sm:left-10 lg:left-16"
          >
            <Monogram />
          </a>
          {LOCALES.map((l) => (
            <NotFoundContent key={l} lang={l} />
          ))}
        </main>
      </body>
    </html>
  );
}
