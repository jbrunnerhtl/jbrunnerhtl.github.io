import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { PORTFOLIO_DATA, repoUrl, type ProjectItem } from "@/data/portfolioData";
import { SITE_URL, siteUrl } from "@/lib/site";

/**
 * JSON-LD for a project page: the project as SoftwareSourceCode, authored by the same Person the
 * home page describes (same @id).
 */
export default async function ProjectStructuredData({ project, lang }: { project: ProjectItem; lang: Locale }) {
  const t = await getDictionary(lang);
  const copy = t.projects.items[project.id];
  const repository = project.repoUrl ?? repoUrl(project.repo);
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${siteUrl(`${lang}/projects/${project.id}`)}#project`,
    name: copy.title,
    description: copy.description,
    url: siteUrl(`${lang}/projects/${project.id}`),
    codeRepository: repository,
    programmingLanguage: project.language,
    keywords: project.stack,
    dateCreated: project.year,
    inLanguage: lang,
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PORTFOLIO_DATA.profile.name, url: siteUrl(lang) },
    ...(project.demoUrl ? { sameAs: [project.demoUrl] } : {}),
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
