import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import StatsStation from "@/components/sections/StatsStation";
import Station from "@/components/journey/Station";
import { getGithubStats } from "@/lib/github";

// Copy comes from the I18nProvider in the [lang] layout; GitHub stats are shared across locales.
// Each section is a Station of the space journey (Projects splits itself into several); in the
// stacked fallback the Station wrappers don't affect layout.
export default async function Home() {
  const stats = await getGithubStats();

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Station name="hero">
        <HeroSection stats={stats} />
      </Station>
      <StatsStation stats={stats} />
      <Station name="about" section="about">
        <AboutSection />
      </Station>
      <ProjectsSection repoCount={stats.publicRepos} />
      <Station name="skills" section="skills">
        <SkillsSection />
      </Station>
      <Station name="contact" section="contact">
        <ContactSection followers={stats.followers} />
      </Station>
    </main>
  );
}
