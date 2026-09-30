import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/project/ProjectPage";
import ProjectStructuredData from "@/components/seo/ProjectStructuredData";
import { PORTFOLIO_DATA, type ProjectItem } from "@/data/portfolioData";
import { highlightAll } from "@/lib/highlight";
import { LOCALES, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { OG_IMAGE_SIZE, siteUrl } from "@/lib/site";

// Only the six featured projects exist; any other slug is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return PORTFOLIO_DATA.projects.map((p) => ({ slug: p.id }));
}

const findProject = (slug: string): ProjectItem | undefined => PORTFOLIO_DATA.projects.find((p) => p.id === slug);

const OG_LOCALE: Record<Locale, string> = { en: "en_US", de: "de_AT" };

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!project || !hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  const copy = t.projects.items[project.id];
  const title = `${copy.title} — ${PORTFOLIO_DATA.profile.name}`;
  const url = siteUrl(`${lang}/projects/${project.id}`);
  // The language's preview image; project pages don't have their own.
  const image = { url: siteUrl(`${lang}/og.png`), ...OG_IMAGE_SIZE, type: "image/png", alt: title };
  return {
    title,
    description: copy.summary,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((l) => [l, siteUrl(`${l}/projects/${project.id}`)])),
    },
    openGraph: {
      title,
      description: copy.summary,
      url,
      siteName: PORTFOLIO_DATA.profile.name,
      type: "article",
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description: copy.summary, images: [image] },
  };
}

export default async function Project({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!project || !hasLocale(lang)) notFound();

  // Highlighted at build time, like the home page mockups.
  const html = await highlightAll([project.mockup.snippet, ...project.details]);

  return (
    <main>
      <ProjectStructuredData project={project} lang={lang} />
      <ProjectPage id={project.id} html={html} />
    </main>
  );
}
