import type { Locale } from "@/i18n/config";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { PORTFOLIO_DATA, repoUrl } from "@/data/portfolioData";
import { SITE_URL, siteUrl } from "@/lib/site";

/**
 * JSON-LD for search engines: the page is a ProfilePage about Jan Brunner (a Person), part of the
 * WebSite, with the featured projects as SoftwareSourceCode by that person. Built from the same data
 * as the visible page; the email is left out on purpose.
 */
export default async function StructuredData({ lang }: { lang: Locale }) {
  const { meta, profile: copy, projects: projectCopy } = await getDictionary(lang);
  const { profile, skills } = PORTFOLIO_DATA;
  const person = `${SITE_URL}/#person`;
  const website = `${SITE_URL}/#website`;
  const projects = PORTFOLIO_DATA.projects.map((p) => {
    const repository = p.repoUrl ?? repoUrl(p.repo);
    return {
      "@type": "SoftwareSourceCode",
      "@id": repository,
      name: projectCopy.items[p.id].title,
      description: projectCopy.items[p.id].description,
      codeRepository: repository,
      programmingLanguage: p.language,
      url: p.demoUrl ?? repository,
      inLanguage: lang,
      author: { "@id": person },
    };
  });

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": website,
        url: siteUrl(),
        name: profile.name,
        inLanguage: [...LOCALES],
      },
      {
        "@type": "ProfilePage",
        "@id": siteUrl(lang),
        url: siteUrl(lang),
        name: meta.title,
        description: meta.description,
        inLanguage: lang,
        // Build time: the daily rebuild refreshes the stats shown on the page.
        dateModified: new Date().toISOString(),
        isPartOf: { "@id": website },
        mainEntity: { "@id": person },
        hasPart: projects.map((p) => ({ "@id": p["@id"] })),
      },
      {
        "@type": "Person",
        "@id": person,
        name: profile.name,
        givenName: profile.givenName,
        familyName: profile.familyName,
        alternateName: profile.handle,
        url: siteUrl(lang),
        image: siteUrl("icon.png"),
        jobTitle: copy.jobTitle,
        description: copy.heroLine,
        sameAs: [profile.githubUrl],
        affiliation: { "@type": "EducationalOrganization", name: profile.school, url: profile.schoolUrl },
        address: { "@type": "PostalAddress", addressRegion: copy.location, addressCountry: "AT" },
        knowsAbout: skills.flatMap((group) => group.items),
      },
      ...projects,
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
