"use client";

import React from "react";
import Station from "@/components/journey/Station";
import { useJourney } from "@/components/journey/JourneyProvider";
import { useStatFacts } from "./HeroSection";
import type { GithubStats } from "@/lib/github";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Space journey only: the GitHub stats as a station of their own, right after the hero, with
 * large glowing numbers beside their planet. The stacked page shows them in the hero instead.
 */
export default function StatsStation({ stats }: { stats: GithubStats }) {
  const journey = useJourney();
  const { t } = useI18n();
  const facts = useStatFacts(stats, 0.2);
  if (!journey) return null;

  return (
    <Station name="stats">
      <section aria-labelledby="stats-title" className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div data-depth="1" className="eyebrow">
          <span className="text-accent">★</span>
          <span className="mx-2">/</span>
          {t.hero.statsLabel}
        </div>
        <h2
          id="stats-title"
          data-depth="1.5"
          className="mt-4 text-[clamp(1.875rem,5.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-fg"
        >
          {t.hero.statsTitle} <span className="text-chrome">{t.hero.statsTitleHighlight}</span>
        </h2>
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:mt-14 sm:gap-y-14">
          {facts.map((f, i) => (
            <div key={f.label} data-depth={2.2 + i * 0.7} className="flex flex-col-reverse justify-end">
              <dt className="eyebrow mt-3">{f.label}</dt>
              <dd className={`stat-value font-semibold tracking-tight ${f.small ? "text-xl sm:text-3xl" : "whitespace-nowrap text-[clamp(1.875rem,8vw,3rem)] leading-none lg:text-[clamp(2.5rem,5.5vw,4.75rem)]"}`}>
                {f.value}
              </dd>
              <span aria-hidden className="stat-line" />
            </div>
          ))}
        </dl>
      </section>
    </Station>
  );
}
