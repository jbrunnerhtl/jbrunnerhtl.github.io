"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import Button from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/MotionWrapper";
import { CountUpText } from "@/components/ui/AnimatedCounter";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { useI18n } from "@/i18n/I18nProvider";

/** The address as a chip with a copy button; announces "Copied!" to screen readers. */
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
    <div className="mx-auto mt-8 inline-flex max-w-full items-center gap-1 rounded-full border border-line py-1 pl-4 pr-1 sm:mt-10">
      <a
        id="contact-email"
        href={`mailto:${email}`}
        className="truncate font-mono text-sm text-fg transition-colors hover:text-accent"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-tint/[0.06] hover:text-fg"
        aria-label={t.contact.copy}
        title={t.contact.copy}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
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
    <section id="contact" className="mx-auto max-w-6xl px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pt-36">
      <FadeIn className="card relative overflow-hidden px-5 py-14 text-center sm:px-12 sm:py-24">
        <div data-depth="1" className="eyebrow">
          <span className="text-accent">04</span>
          <span className="mx-2">/</span>
          {t.contact.label}
        </div>
        <h2 data-depth="1.6" className="mx-auto mt-6 max-w-3xl text-[clamp(2.25rem,8vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-fg">
          {t.contact.title} <span className="text-chrome">{t.contact.titleHighlight}</span>
        </h2>
        <p data-depth="2.2" className="mx-auto mt-6 max-w-md text-muted">{t.contact.text}</p>

        <div data-depth="2.8">
          <EmailCopy email={profile.email} />
        </div>

        <div data-depth="3.4" className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${profile.email}`} icon={<ArrowUpRight className="h-4 w-4" />}>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {t.contact.email}
            </span>
          </Button>
          <Button variant="secondary" href={profile.githubUrl}>
            <span className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4" /> {t.contact.follow}
            </span>
          </Button>
        </div>
        <p data-depth="4" className="mt-6 text-xs text-faint">
          <CountUpText template={t.contact.followers} n={followers} />
        </p>
      </FadeIn>

      <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-sm text-faint sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>
          {profile.school} · {t.profile.location}
        </span>
      </footer>
    </section>
  );
}
