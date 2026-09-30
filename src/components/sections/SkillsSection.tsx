"use client";

import React from "react";
import SectionDivider from "@/components/ui/SectionDivider";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useI18n } from "@/i18n/I18nProvider";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** The milestones and every skill group as static lists, side by side on wide screens. */
export default function SkillsSection() {
  const { t } = useI18n();
  return (
    <section id="skills" data-nav="skills" aria-labelledby="skills-title" className="mx-auto w-full max-w-[88rem] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
      <SectionDivider label={t.skills.label} />
      <h2 id="skills-title" data-reveal style={delay(1)} className="mt-8 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] text-fg">
        {t.skills.title} <span className="text-accent-text">{t.skills.titleHighlight}</span>
      </h2>
      <p data-reveal style={delay(2)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {t.skills.intro}
      </p>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div data-reveal style={delay(1)} className="lg:col-span-4">
          <h3 className="eyebrow">{t.about.timeline}</h3>
          <ol className="relative mt-8 space-y-10 border-l border-line pl-8">
            {t.about.milestones.map((m) => (
              <li key={m.title} className="relative">
                <span aria-hidden className="absolute -left-[37px] top-1.5 h-2 w-2 bg-accent ring-4 ring-bg" />
                <div className="font-mono text-xs text-faint">{m.year}</div>
                <div className="mt-2 font-medium text-fg">{m.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{m.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {PORTFOLIO_DATA.skills.map((group, i) => (
            <div key={group.id} data-reveal style={delay(i + 2)}>
              <h3 id={`skills-${group.id}`} className="eyebrow">
                {t.skills.groups[group.id]}
              </h3>
              <ul aria-labelledby={`skills-${group.id}`} className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="border border-line px-3 py-1.5 text-[0.9375rem] text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
