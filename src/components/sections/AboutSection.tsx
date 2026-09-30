"use client";

import React from "react";
import { Send } from "lucide-react";
import DecoderText from "@/components/effects/DecoderText";
import SectionDivider from "@/components/ui/SectionDivider";
import { useStatFacts } from "./statFacts";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { BASE_PATH } from "@/lib/basePath";
import { scrollToSection } from "@/lib/scroll";
import type { GithubStats } from "@/lib/github";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function AboutSection({ stats }: { stats: GithubStats }) {
  const { t } = useI18n();
  const { profile } = PORTFOLIO_DATA;
  const facts = useStatFacts(stats, 0.2);

  return (
    <section id="about" data-nav="about" aria-labelledby="about-title" className="mx-auto w-full max-w-[88rem] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="about-title" className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-fg">
            <DecoderText text={t.about.greeting} />
          </h2>

          <div data-reveal style={delay(1)} className="mt-8 max-w-xl space-y-6 text-lg leading-[1.8] text-muted">
            <p>
              {t.about.p1Before}
              <a href={profile.schoolUrl} target="_blank" rel="noopener noreferrer" className="link-accent">
                {t.about.p1Highlight}
              </a>
              {fmt(t.about.p1After, { year: profile.codingSince })}
            </p>
            <p>{t.about.p2}</p>
          </div>

          <dl data-reveal style={delay(2)} className="mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse justify-end">
                <dt className="eyebrow mt-2">{f.label}</dt>
                <dd className={`font-medium tracking-tight text-fg ${f.small ? "text-lg" : "text-3xl"}`}>{f.value}</dd>
              </div>
            ))}
          </dl>

          <a
            data-reveal
            style={delay(3)}
            href="#contact"
            onClick={(e) => {
              if (scrollToSection("contact")) e.preventDefault();
            }}
            className="group mt-12 inline-flex items-center gap-3 text-lg font-medium text-accent-text"
          >
            <Send aria-hidden className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" fill="currentColor" strokeWidth={1.5} />
            {t.about.message}
          </a>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <SectionDivider label={t.about.label} />
          <div data-reveal style={delay(1)} className="relative mt-10 max-w-md pr-14 sm:pr-20">
            {/* Accent block behind the picture and the handle as vertical lettering (decorative). */}
            <span aria-hidden className="absolute -bottom-6 right-6 top-10 w-1/3 bg-accent sm:right-10" />
            <span aria-hidden className="outline-letters about-handle absolute -right-1 top-0 text-[clamp(1.75rem,3vw,2.75rem)]">
              {profile.handle.toUpperCase()}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
            <img
              src={`${BASE_PATH}/profile.jpg`}
              alt={t.about.photoAlt}
              width={460}
              height={460}
              loading="lazy"
              decoding="async"
              className="relative aspect-square w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
