"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { CountUpText } from "@/components/ui/AnimatedCounter";
import { PORTFOLIO_DATA, repoUrl } from "@/data/portfolioData";
import Station from "@/components/journey/Station";
import { useJourney } from "@/components/journey/JourneyProvider";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

// GitHub's own language colors.
const LANG_COLOR: Record<string, string> = {
  Java: "#b07219",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  "C++": "#f34b7d",
  Rust: "#dea584",
  HTML: "#e34c26",
};

function LangDot({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLOR[language] ?? "#8b949e" }} />
      {language}
    </span>
  );
}

type Project = (typeof PORTFOLIO_DATA.projects)[number];

/** Tilt and sheen follow the mouse (see .card-tilt); written to CSS variables, so nothing re-renders. */
function trackPointer(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
}

function resetPointer(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty("--rx");
  e.currentTarget.style.removeProperty("--ry");
}

const CONTAINER = "mx-auto max-w-6xl px-5 sm:px-8 lg:px-10";

function ProjectCard({ p, depth = 2 }: { p: Project; depth?: number }) {
  const { t } = useI18n();
  return (
    // The wrapper carries the journey's depth transform, so the card's own hover transform stays free.
    <div data-depth={depth} className="h-full">
      <article
        className="card card-hover card-tilt group relative flex h-full flex-col p-5 sm:p-8"
        style={{ "--glow": LANG_COLOR[p.language] ?? "#8b949e" } as React.CSSProperties}
        onPointerMove={trackPointer}
        onPointerLeave={resetPointer}
      >
        <div className="flex items-center justify-between">
          <LangDot language={p.language} />
          <span className="flex items-center gap-3">
            {p.teamSize && (
              <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                {fmt(t.projects.team, { n: p.teamSize })}
              </span>
            )}
            <span className="font-mono text-xs text-faint">{p.year}</span>
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-fg sm:mt-6 sm:text-2xl">
          <a href={p.repoUrl ?? repoUrl(p.repo)} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
            {t.projects.items[p.id].title}
          </a>
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{t.projects.items[p.id].description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
          <span className="inline-flex min-w-0 items-center gap-2 text-muted transition-colors group-hover:text-fg">
            <GithubIcon className="h-4 w-4 shrink-0" /> <span className="truncate">{p.repoLabel ?? p.repo}</span>
          </span>
          {p.demoUrl ? (
            <a
              href={p.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 -my-2 inline-flex shrink-0 items-center gap-1 py-2 pl-3 text-accent hover:underline"
            >
              {t.projects.live} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <ArrowUpRight className="h-4 w-4 text-faint transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
          )}
        </div>
      </article>
    </div>
  );
}

function ProjectsHeader() {
  const { t } = useI18n();
  return (
    <SectionHeader
      index="02"
      label={t.projects.label}
      title={
        <>
          {t.projects.title} <span className="text-chrome">{t.projects.titleHighlight}</span>
        </>
      }
    >
      {t.projects.intro}
    </SectionHeader>
  );
}

function MoreRepos({ repoCount }: { repoCount: number }) {
  const { t } = useI18n();
  const { moreRepos, profile } = PORTFOLIO_DATA;
  return (
    <>
      <div data-depth="1" className="eyebrow mb-4">{t.projects.more}</div>
      <ul className="divide-y divide-line border-y border-line">
        {moreRepos.map((r, i) => (
          <li key={r.name} data-depth={1.4 + Math.min(i, 6) * 0.45}>
            <a
              href={repoUrl(r.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-4 transition-colors hover:bg-tint/[0.02] sm:gap-4 sm:px-2"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-fg sm:w-56 sm:flex-none">{r.name}</span>
              <span className="hidden flex-1 truncate text-sm text-muted sm:block">{t.projects.repoNotes[r.name]}</span>
              <span className="shrink-0 sm:w-28">
                <LangDot language={r.language} />
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
            </a>
          </li>
        ))}
      </ul>
      <div data-depth="4.4" className="mt-8">
        <Button variant="secondary" href={`${profile.githubUrl}?tab=repositories`} icon={<ArrowUpRight className="h-4 w-4" />}>
          <CountUpText template={t.projects.all} n={repoCount} />
        </Button>
      </div>
    </>
  );
}

export default function ProjectsSection({ repoCount }: { repoCount: number }) {
  const journey = useJourney();
  const { projects } = PORTFOLIO_DATA;

  // Space journey: every project is a station of its own, beside its own planet; the heading
  // arrives with the first one, then the repository list is a station too.
  if (journey) {
    return (
      <section id="projects" className="contents">
        {projects.map((p, i) => (
          <Station key={p.id} name={`projects-${i + 1}`} section="projects">
            <div className={CONTAINER}>
              {i === 0 && <ProjectsHeader />}
              <ProjectCard p={p} depth={i === 0 ? 2.6 : 1.6} />
            </div>
          </Station>
        ))}
        <Station name="projects-more" section="projects">
          <FadeIn className={CONTAINER}>
            <MoreRepos repoCount={repoCount} />
          </FadeIn>
        </Station>
      </section>
    );
  }

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      <ProjectsHeader />

      <StaggerContainer className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <StaggerItem key={p.id} className="h-full min-w-0">
            <ProjectCard p={p} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn className="mt-16 sm:mt-20">
        <MoreRepos repoCount={repoCount} />
      </FadeIn>
    </section>
  );
}
