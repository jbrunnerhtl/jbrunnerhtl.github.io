"use client";

import React from "react";
import AnimatedCounter, { CountUpText } from "@/components/ui/AnimatedCounter";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import type { GithubStats } from "@/lib/github";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

/** The GitHub stats shown in the About section, counting up once visible. */
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
