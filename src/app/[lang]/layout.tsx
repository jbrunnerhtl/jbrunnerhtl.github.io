import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "../fonts";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Background from "@/components/3d/Background";
import JourneyProvider from "@/components/journey/JourneyProvider";
import { LOCALES, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { OG_IMAGE_SIZE, SITE_URL, siteUrl } from "@/lib/site";

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
  const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
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
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The site only has a dark mode (a space scene).
  themeColor: "#09090b",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={fontClasses}>
      <body className="isolate min-h-full bg-bg font-sans text-fg">
        <I18nProvider initialLang={lang}>
          <SmoothScrollProvider>
            <Background />
            <JourneyProvider>{children}</JourneyProvider>
          </SmoothScrollProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
