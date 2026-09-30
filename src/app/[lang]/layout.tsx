import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "../fonts";
import Sidebar from "@/components/navigation/Sidebar";
import RevealObserver from "@/components/effects/RevealObserver";
import HashScroll from "@/components/effects/HashScroll";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LOCALES, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { OG_IMAGE_SIZE, SITE_URL, siteUrl, siteVerification } from "@/lib/site";
import { THEME_COLOR, THEME_SCRIPT } from "@/lib/theme";

// Prerender /en and /de; any other locale segment is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", de: "de_AT" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta, profile: copy } = await getDictionary(lang);
  const { profile } = PORTFOLIO_DATA;
  const image = { url: siteUrl(`${lang}/og.png`), ...OG_IMAGE_SIZE, type: "image/png", alt: `${profile.name} — ${copy.heroLine}` };
  return {
    metadataBase: new URL(`${SITE_URL}/`),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: profile.name, url: profile.githubUrl }],
    // Absolute URLs throughout; the root language chooser is the x-default.
    alternates: {
      canonical: siteUrl(lang),
      languages: Object.fromEntries([...LOCALES.map((l) => [l, siteUrl(l)]), ["x-default", siteUrl()]]),
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: siteUrl(lang),
      siteName: profile.name,
      type: "website",
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.ogDescription, images: [image] },
    verification: siteVerification(),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Dark by default; ThemeProvider updates it to the active color mode.
  themeColor: THEME_COLOR.dark,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    // The pre-paint script sets data-theme and class="js" on <html>, so the server attributes differ.
    <html lang={lang} className={fontClasses} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="isolate min-h-full bg-bg font-sans text-fg">
        <I18nProvider initialLang={lang}>
          <ThemeProvider>
            <Sidebar />
            <RevealObserver />
            <HashScroll />
            {/* Room for the fixed sidebar on wide screens. */}
            <div className="lg:pl-24">{children}</div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
