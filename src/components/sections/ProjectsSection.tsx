"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Mockup from "@/components/mockups/Mockup";
import SectionDivider from "@/components/ui/SectionDivider";
import { CountUpText } from "@/components/ui/AnimatedCounter";
import { PORTFOLIO_DATA, repoUrl, type ProjectItem } from "@/data/portfolioData";
import { SNIPPETS, type SnippetId } from "@/data/snippets";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

// GitHub's own language colors.
export const LANG_COLOR: Record<string, string> = {
  Java: "#b07219",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  "C++": "#f34b7d",
  Rust: "#dea584",
  HTML: "#e34c26",
};

export function LangDot({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLOR[language] ?? "#8b949e" }} />
      {language}
    </span>
  );
}

/** Language, year and (for team projects) the team size. */
export function ProjectMeta({ p, className = "" }: { p: ProjectItem; className?: string }) {
  const { t } = useI18n();
  return (
    <p className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted ${className}`}>
      <LangDot language={p.language} />
      <span className="font-mono text-faint">{p.year}</span>
      {p.teamSize && <span className="border border-line px-2 py-0.5 text-xs">{fmt(t.projects.team, { n: p.teamSize })}</span>}
    </p>
  );
}

/** Title bar text of a mockup: the command for terminals, the file name otherwise. */
export function mockupTitle(p: ProjectItem, snippet: SnippetId) {
  if (p.mockup.kind === "terminal") return `zsh — ${p.repo.toLowerCase()}`;
  return SNIPPETS[snippet].file.split("/").pop() ?? "";
}

function ProjectSection({ p, index, html }: { p: ProjectItem; index: number; html: string }) {
  const { t, lang } = useI18n();
  const copy = t.projects.items[p.id];
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const titleId = `project-${p.id}-title`;

  return (
    <section
      id={index === 0 ? "projects" : undefined}
      data-nav="projects"
      aria-labelledby={titleId}
      className="relative flex min-h-[100svh] items-center overflow-hidden py-24 lg:py-16"
    >
      {index === 0 && <h2 className="sr-only">{t.projects.label}</h2>}
      <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-14 px-6 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
          <SectionDivider number={number} />
          <h3 id={titleId} data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8 text-[clamp(1.875rem,3.4vw,2.875rem)] font-medium leading-[1.12] tracking-[-0.02em] text-fg">
            {copy.title}
          </h3>
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <ProjectMeta p={p} className="mt-5" />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{copy.summary}</p>
          </div>
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-10">
            <Link href={`/${lang}/projects/${p.id}/`} className="btn-accent">
              {t.projects.view}
              <span className="sr-only">: {copy.title}</span>
              <ArrowRight aria-hidden className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className={`relative lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          {/* The project's language as huge outlined lettering behind the mockup (decorative). */}
          <span
            aria-hidden
            className={`outline-letters absolute -bottom-[0.28em] z-0 ${flip ? "-left-4" : "-right-4"}`}
            // Long names ("TYPESCRIPT") get smaller, so the word stays behind the mockup.
            style={{ fontSize: `clamp(4rem, ${(15 * Math.min(1, 5 / p.language.length)).toFixed(1)}vw, 15rem)` }}
          >
            {p.language.toUpperCase()}
          </span>
          <Mockup
            kind={p.mockup.kind}
            html={html}
            title={mockupTitle(p, p.mockup.snippet)}
            label={fmt(t.projects.mockupLabel, { file: SNIPPETS[p.mockup.snippet].file.split("/").pop() ?? "", title: copy.title })}
            clip
            className="relative z-10"
          />
        </div>
      </div>
    </section>
  );
}

function MoreRepos({ repoCount }: { repoCount: number }) {
  const { t } = useI18n();
  const { moreRepos, profile } = PORTFOLIO_DATA;
  return (
    <section data-nav="projects" aria-labelledby="more-repos-title" className="mx-auto w-full max-w-[88rem] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <SectionDivider label={t.projects.more} />
      <h2 id="more-repos-title" data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8 max-w-2xl text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">
        {t.projects.moreTitle}
      </h2>
      <ul data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-12 divide-y divide-line border-y border-line">
        {moreRepos.map((r) => (
          <li key={r.name}>
            <a
              href={repoUrl(r.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-5 transition-colors sm:gap-6"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-fg transition-colors group-hover:text-accent-text sm:w-64 sm:flex-none">{r.name}</span>
              <span className="hidden flex-1 truncate text-muted sm:block">{t.projects.repoNotes[r.name]}</span>
              <span className="shrink-0 text-sm text-muted sm:w-28">
                <LangDot language={r.language} />
              </span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-faint transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
            </a>
          </li>
        ))}
      </ul>
      <div data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-10">
        <a href={`${profile.githubUrl}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lg font-medium text-accent-text">
          <CountUpText template={t.projects.all} n={repoCount} />
          <ArrowUpRight aria-hidden className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}

/** Six full-height project sections, then the list of further repositories. */
export default function ProjectsSection({ repoCount, mockups }: { repoCount: number; mockups: Record<string, string> }) {
  return (
    <>
      {PORTFOLIO_DATA.projects.map((p, i) => (
        <ProjectSection key={p.id} p={p} index={i} html={mockups[p.mockup.snippet]} />
      ))}
      <MoreRepos repoCount={repoCount} />
    </>
  );
}
