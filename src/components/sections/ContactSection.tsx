"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import DecoderText from "@/components/effects/DecoderText";
import SectionDivider from "@/components/ui/SectionDivider";
import { CountUpText } from "@/components/ui/AnimatedCounter";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useI18n } from "@/i18n/I18nProvider";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** The address with a copy button; announces "Copied!" to screen readers. */
function EmailCopy({ email }: { email: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): select the text so it can be copied by hand.
      const el = document.getElementById("contact-email");
      if (el) window.getSelection()?.selectAllChildren(el);
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex max-w-full items-center gap-1 border border-line py-1 pl-4 pr-1">
      <a id="contact-email" href={`mailto:${email}`} className="truncate font-mono text-sm text-fg transition-colors hover:text-accent-text sm:text-base">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="grid h-11 w-11 shrink-0 place-items-center text-muted transition-colors hover:text-accent-text"
        aria-label={t.contact.copy}
        title={t.contact.copy}
      >
        {copied ? <Check className="h-4 w-4 text-accent-text" /> : <Copy className="h-4 w-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.contact.copied : ""}
      </span>
    </div>
  );
}

export default function ContactSection({ followers }: { followers: number }) {
  const { t } = useI18n();
  const { profile } = PORTFOLIO_DATA;

  return (
    <>
      <section id="contact" data-nav="contact" aria-labelledby="contact-title" className="mx-auto flex min-h-[80svh] w-full max-w-[88rem] flex-col justify-center px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        <SectionDivider label={t.contact.label} />
        <h2 id="contact-title" className="mt-8 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
          <DecoderText text={t.contact.heading} />
        </h2>
        <p data-reveal style={delay(1)} className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
          {t.contact.text}
        </p>

        <div data-reveal style={delay(2)} className="mt-10">
          <EmailCopy email={profile.email} />
        </div>

        <div data-reveal style={delay(3)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
          <a href={`mailto:${profile.email}`} className="btn-accent">
            {t.contact.email}
            <ArrowRight aria-hidden className="h-5 w-5" />
          </a>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lg font-medium text-fg transition-colors hover:text-accent-text">
            <GithubIcon className="h-5 w-5" /> {t.contact.follow}
            <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
        <p data-reveal style={delay(4)} className="mt-6 text-sm text-faint">
          <CountUpText template={t.contact.followers} n={followers} />
        </p>
      </section>

      <footer className="mx-auto flex w-full max-w-[88rem] flex-col gap-2 border-t border-line px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 text-sm text-faint sm:flex-row sm:justify-between sm:px-10 lg:px-16">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          {profile.school} · {t.profile.location}
        </span>
      </footer>
    </>
  );
}
