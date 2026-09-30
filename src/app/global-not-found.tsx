import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import "./globals.css";
import { fontClasses } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import GithubIcon from "@/components/icons/GithubIcon";
import Button from "@/components/ui/Button";
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
  return (
    <div data-locale={lang}>
      <p className="eyebrow">
        <span className="text-accent">404</span>
        <span className="mx-2">/</span>
        {t.notFound.title}
      </p>
      {/* Reuses the hero's CSS reveal, so it animates without any client JS. */}
      <h1 className="mt-6 text-[clamp(5rem,22vw,13rem)] font-semibold leading-[0.85] tracking-[-0.06em]">
        <span className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] pr-[0.06em] -mr-[0.06em]">
          <span className="reveal-word text-chrome inline-block" style={{ animationDelay: "0.1s" }}>
            404
          </span>
        </span>
      </h1>
      <h2 className="mt-8 text-[clamp(1.5rem,4.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em] text-fg">
        {t.notFound.heading}
      </h2>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">{t.notFound.text}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href={localePath(lang)}>
          <span className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> {t.notFound.back}
          </span>
        </Button>
        <Button variant="secondary" href={PORTFOLIO_DATA.profile.githubUrl}>
          <span className="flex items-center gap-2">
            <GithubIcon className="h-4 w-4" /> GitHub
          </span>
        </Button>
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
        <main className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-start justify-center px-5 py-24 sm:px-8 lg:px-10">
          <a
            href={`${BASE_PATH}/`}
            className="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] flex items-center gap-2.5 text-sm font-medium text-fg sm:left-8 lg:left-10"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-fg text-[11px] font-bold text-bg">JB</span>
            {PORTFOLIO_DATA.profile.name}
          </a>
          {LOCALES.map((l) => (
            <NotFoundContent key={l} lang={l} />
          ))}
        </main>
      </body>
    </html>
  );
}
