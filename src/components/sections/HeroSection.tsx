"use client";

import React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GithubIcon from "@/components/icons/GithubIcon";
import Button from "@/components/ui/Button";
import AnimatedCounter, { CountUpText } from "@/components/ui/AnimatedCounter";
import { RevealText } from "@/components/ui/MotionWrapper";
import NameSwap, { type NameSegment } from "@/components/ui/NameSwap";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useScrollTo } from "@/components/providers/SmoothScrollProvider";
import { useJourney } from "@/components/journey/JourneyProvider";
import type { GithubStats } from "@/lib/github";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

const EASE = [0.16, 1, 0.3, 1] as const;

// The hero name alternates between the real name and the GitHub handle.
const NAMES: NameSegment[][] = [
  [
    { text: "Jan ", className: "text-fg" },
    { text: "Brunner.", className: "text-chrome" },
  ],
  [
    { text: "J", className: "text-fg" },
    { text: "Brunnerhtl", className: "text-chrome" },
  ],
];

/** The GitHub stats, shared by the hero (stacked page) and the stats station (space journey). */
export function useStatFacts(stats: GithubStats, countDelay: number) {
  const { t } = useI18n();
  const { profile } = PORTFOLIO_DATA;
  const years = new Date().getFullYear() - profile.codingSince;
  const COUNT_DELAY = countDelay;
  return [
    { value: <AnimatedCounter value={stats.publicRepos} delay={COUNT_DELAY} />, label: t.hero.statRepos },
    { value: <>Top <AnimatedCounter value={15} delay={COUNT_DELAY + 0.1} /></>, label: t.hero.statContest },
    {
      // "{n}+ yrs" / "{n}+ Jahre": animate the number, keep the translated unit around it.
      value: <CountUpText template={t.hero.statYears} n={years} delay={COUNT_DELAY + 0.2} />,
      label: fmt(t.hero.statSince, { year: profile.codingSince }),
    },
    { value: stats.topLanguages.join(" · "), label: t.hero.statLanguages, small: true },
  ];
}

export default function HeroSection({ stats }: { stats: GithubStats }) {
  const scrollTo = useScrollTo();
  const { t } = useI18n();
  const { profile } = PORTFOLIO_DATA;
  // The stats row fades in at 0.95s; start counting just after so the count-up is actually visible.
  const facts = useStatFacts(stats, 1.05);
  // In the space journey the stats get a station of their own (StatsStation).
  const journey = useJourney();

  return (
    <section id="hero" className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-10 short:pb-4 short:pt-[6.5rem]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="mb-6 flex items-start gap-3 text-sm text-muted sm:mb-8 sm:items-center short:mb-3"
      >
        <span className="relative mt-1.5 flex h-2 w-2 shrink-0 sm:mt-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        {t.profile.heroLine}
      </motion.div>

      <h1 data-depth="2" className="max-w-4xl text-[clamp(2.75rem,11vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] short:text-[clamp(2.25rem,min(11vw,17svh),7.5rem)]">
        <NameSwap
          names={NAMES}
          label={profile.name}
          intro={
            <>
              <RevealText text="Jan" className="text-fg" delay={0.15} />{" "}
              <RevealText text="Brunner." className="text-chrome" delay={0.25} />
            </>
          }
        />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: EASE }}
        className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:mt-8 sm:text-xl short:mt-4 short:max-w-2xl short:text-sm"
      >
        {t.hero.tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
        className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 short:mt-4"
      >
        <Button onClick={() => scrollTo("projects")} icon={<ArrowRight className="h-4 w-4" />}>
          {t.hero.viewProjects}
        </Button>
        <Button variant="secondary" href={profile.githubUrl}>
          <span className="flex items-center gap-2">
            <GithubIcon className="h-4 w-4" /> @{profile.handle}
          </span>
        </Button>
      </motion.div>

      {!journey && (
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.95 }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:mt-20 lg:grid-cols-4"
        >
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse justify-end">
              <dt className="eyebrow mt-2">{f.label}</dt>
              <dd className={`font-semibold tracking-tight text-fg ${f.small ? "text-base sm:text-xl" : "text-2xl sm:text-3xl"}`}>
                {f.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      )}

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        onClick={() => scrollTo("about")}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-fg sm:flex [@media(max-height:760px)]:hidden"
        aria-label={t.hero.scrollHint}
      >
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
