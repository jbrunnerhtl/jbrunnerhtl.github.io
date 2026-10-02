"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import Mockup from "@/components/mockups/Mockup";
import SectionDivider from "@/components/ui/SectionDivider";
import { LangDot, mockupTitle } from "@/components/sections/ProjectsSection";
import { PORTFOLIO_DATA, repoUrl, type ProjectId } from "@/data/portfolioData";
import { SNIPPETS } from "@/data/snippets";
import { useI18n } from "@/i18n/I18nProvider";
import { fmt } from "@/i18n/config";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-5">
      <dt className="eyebrow">{term}</dt>
      <dd className="mt-2 text-lg text-fg">{children}</dd>
    </div>
  );
}

/** A project's detail page: header with facts, the mockup, features, how it's built, code, next. */
export default function ProjectPage({ id, html }: { id: ProjectId; html: Record<string, string> }) {
  const { t, lang } = useI18n();
  const { projects } = PORTFOLIO_DATA;
  const index = projects.findIndex((p) => p.id === id);
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const copy = t.projects.items[id];
  const labels = t.projects.page;
  const repository = p.repoUrl ?? repoUrl(p.repo);
  const number = (i: number) => String(i + 1).padStart(2, "0");
  const fileName = (snippet: keyof typeof SNIPPETS) => SNIPPETS[snippet].file.split("/").pop() ?? "";

  return (
    <article>
      <header className="mx-auto grid w-full max-w-[88rem] grid-cols-1 gap-14 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:pt-40">
        <div className="lg:col-span-7">
          <SectionDivider number={number(index)} />
          <h1 data-reveal style={delay(1)} className="mt-8 text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            {copy.title}
          </h1>
          <p data-reveal style={delay(2)} className="mt-8 max-w-2xl text-lg leading-[1.8] text-muted sm:text-xl">
            {copy.description}
          </p>
          <div data-reveal style={delay(3)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={repository} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lg font-medium text-fg transition-colors hover:text-accent-text">
              <GithubIcon className="h-5 w-5" /> {labels.github}
              <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {p.demoUrl && (
              <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lg font-medium text-accent-text">
                {t.projects.live}
                <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>

        <dl data-reveal style={delay(2)} className="border-t border-line lg:col-span-4 lg:col-start-9 lg:self-end">
          <Fact term={labels.language}>
            <LangDot language={p.language} />
          </Fact>
          <Fact term={labels.year}>{p.year}</Fact>
          <Fact term={labels.team}>{p.teamSize ? fmt(labels.people, { n: p.teamSize }) : labels.solo}</Fact>
          <Fact term={labels.stack}>
            <ul className="mt-1 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="border border-line px-2.5 py-1 text-sm text-muted">
                  {s}
                </li>
              ))}
            </ul>
          </Fact>
        </dl>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        <Mockup
          kind={p.mockup.kind}
          html={html[p.mockup.snippet]}
          title={mockupTitle(p, p.mockup.snippet)}
          label={fmt(t.projects.mockupLabel, { file: fileName(p.mockup.snippet), title: copy.title })}
        />
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-10 lg:py-32">
        <section aria-labelledby="features-title">
          <h2 id="features-title" data-reveal className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
            {labels.features}
          </h2>
          <ul data-reveal style={delay(1)} className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
            {copy.features.map((f) => (
              <li key={f} className="flex gap-4">
                <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 bg-accent-text" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="built-title" className="mt-24">
          <h2 id="built-title" data-reveal className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
            {labels.built}
          </h2>
          <div data-reveal style={delay(1)} className="mt-8 space-y-6 text-lg leading-[1.8] text-muted">
            {copy.built.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="code-title" className="mt-24">
          <h2 id="code-title" data-reveal className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium tracking-[-0.02em]">
            {labels.code}
          </h2>
          <div className="mt-10 space-y-14">
            {p.details.map((snippet, i) => {
              const s = SNIPPETS[snippet];
              return (
                <div key={snippet}>
                  <Mockup kind="window" html={html[snippet]} title={fileName(snippet)} label={copy.snippetNotes[i]} />
                  <p className="mt-4 text-muted">
                    {copy.snippetNotes[i]}{" "}
                    <a href={`${repository}/blob/${s.branch}/${s.file}`} target="_blank" rel="noopener noreferrer" className="link-accent whitespace-nowrap font-mono text-sm">
                      {labels.source}: {fileName(snippet)}
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <nav aria-label={labels.next} className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-10 px-6 py-20 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <Link href={`/${lang}/projects/${next.id}/`} className="group block">
            <span className="eyebrow">{labels.next}</span>
            <span className="mt-4 flex items-baseline gap-5">
              <span className="font-mono text-accent-text">{number((index + 1) % projects.length)}</span>
              <span className="text-[clamp(2rem,5vw,4rem)] font-medium leading-tight tracking-[-0.03em] text-fg transition-colors group-hover:text-accent-text">
                {t.projects.items[next.id].title}
              </span>
              <ArrowRight aria-hidden className="h-8 w-8 shrink-0 self-center text-accent-text transition-transform duration-500 ease-out-expo group-hover:translate-x-2" />
            </span>
          </Link>
          <Link href={`/${lang}/#projects`} className="group inline-flex items-center gap-2 text-lg font-medium text-muted transition-colors hover:text-fg">
            <ArrowLeft aria-hidden className="h-5 w-5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
            {labels.back}
          </Link>
        </div>
      </nav>
    </article>
  );
}
