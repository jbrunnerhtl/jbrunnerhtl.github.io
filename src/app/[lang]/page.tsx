import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import { getGithubStats } from "@/lib/github";
import StructuredData from "@/components/seo/StructuredData";
import type { Locale } from "@/i18n/config";

// Copy comes from the I18nProvider in the [lang] layout; GitHub stats are shared across locales.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const stats = await getGithubStats();

  return (
    <main className="relative min-h-screen">
      <StructuredData lang={lang as Locale} />
      <HeroSection stats={stats} />
      <ProjectsSection repoCount={stats.publicRepos} />
      <AboutSection />
      <SkillsSection />
      <ContactSection followers={stats.followers} />
    </main>
  );
}
