import type { Locale } from "@/i18n/config";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { SITE_URL, siteUrl } from "@/lib/site";

/**
 * JSON-LD for search engines: the page is a ProfilePage about Jan Brunner (a Person), part of the
 * WebSite. Built from the same data as the visible page; the email is left out on purpose.
 */
export default async function StructuredData({ lang }: { lang: Locale }) {
  const { meta, profile: copy } = await getDictionary(lang);
  const { profile, skills } = PORTFOLIO_DATA;
  const person = `${SITE_URL}/#person`;
  const website = `${SITE_URL}/#website`;

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
        isPartOf: { "@id": website },
        mainEntity: { "@id": person },
      },
      {
        "@type": "Person",
        "@id": person,
        name: profile.name,
        alternateName: profile.handle,
        url: siteUrl(lang),
        description: copy.heroLine,
        sameAs: [profile.githubUrl],
        affiliation: { "@type": "EducationalOrganization", name: profile.school },
        address: { "@type": "PostalAddress", addressRegion: copy.location, addressCountry: "AT" },
        knowsAbout: skills.flatMap((group) => group.items),
      },
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
