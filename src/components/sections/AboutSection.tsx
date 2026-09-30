"use client";

import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

export default function AboutSection() {
  const { t } = useI18n();
  const { profile } = PORTFOLIO_DATA;

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      <SectionHeader
        index="01"
        label={t.about.label}
        title={
          <>
            {t.about.title} <span className="text-chrome">{t.about.titleHighlight}</span>
          </>
        }
      />

      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <FadeIn delay={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg md:col-span-7 lg:col-span-6 lg:col-start-4">
          <p data-depth="2.4">
            {t.about.p1Before}
            <span className="text-fg">{t.about.p1Highlight}</span>
            {fmt(t.about.p1After, { year: profile.codingSince })}
          </p>
          <p data-depth="3">{t.about.p2}</p>
        </FadeIn>

        <StaggerContainer className="md:col-span-5 lg:col-span-3">
          <div data-depth="2" className="eyebrow mb-5">{t.about.timeline}</div>
          <div className="relative space-y-7 border-l border-line pl-6">
            {/* Space journey only: the line draws itself as the station arrives (--fill, see globals.css). */}
            <span aria-hidden className="timeline-fill" />
            {t.about.milestones.map((m, i, all) => (
              <StaggerItem key={m.title}>
                <div data-depth={2.6 + i * 0.6} className="relative">
                  <span
                    className="timeline-dot absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-bg"
                    style={{ "--at": i / all.length } as React.CSSProperties}
                  />
                  <div className="font-mono text-xs text-faint">{m.year}</div>
                  <div className="mt-1 font-medium text-fg">{m.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{m.description}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
