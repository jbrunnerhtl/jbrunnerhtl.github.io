import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontClasses } from "../fonts";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Background from "@/components/3d/Background";
import JourneyProvider from "@/components/journey/JourneyProvider";
import { LOCALES, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { I18nProvider } from "@/i18n/I18nProvider";

// Prerender /en and /de; any other locale segment is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    keywords: ["Jan Brunner", "HTL Leonding", "Software Development", "Portfolio", "Java", "TypeScript", "C#", "C++", "Rust"],
    authors: [{ name: "Jan Brunner", url: "https://github.com/jbrunnerhtl" }],
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: "website",
      locale: lang === "de" ? "de_AT" : "en_US",
    },
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
