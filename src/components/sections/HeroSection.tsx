"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import DecoderText from "@/components/effects/DecoderText";
import HeroBackdrop from "@/components/hero/HeroBackdrop";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { scrollToSection } from "@/lib/scroll";
import { useI18n } from "@/i18n/I18nProvider";

const CYCLE_MS = 3000;

/**
 * Index into the role list, advancing every CYCLE_MS while the hero is on screen and the tab is
 * visible; never with reduced motion.
 */
function useRoleCycle(count: number, target: React.RefObject<HTMLElement | null>) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = target.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let inView = true;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
    io.observe(el);
    const id = setInterval(() => {
      if (inView && document.visibilityState === "visible") setIndex((i) => (i + 1) % count);
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [count, target]);
  return index;
}

export default function HeroSection() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const roles = t.hero.roles;
  const index = useRoleCycle(roles.length, section);

  return (
    <section id="hero" data-nav="" ref={section} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <HeroBackdrop />

      <div className="relative w-full px-6 pb-24 pt-28 sm:px-10 lg:pl-[clamp(4rem,14vw,16rem)] lg:pr-16 short:py-20">
        {/* The page's heading: the name, once, as text. */}
        <h1
          className="hero-in text-base font-medium uppercase tracking-[0.3em] text-muted sm:text-xl lg:text-2xl"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          {PORTFOLIO_DATA.profile.name}
        </h1>

        <h2 className="mt-5 text-[clamp(2.75rem,11vw,7.5rem)] font-medium leading-[1.02] tracking-[-0.035em] sm:mt-8 short:mt-3 short:text-[clamp(2.25rem,16svh,4.5rem)]">
          {/* Stable text for screen readers and search engines; the cycling role below is visual. */}
          <span className="sr-only">
            {t.hero.role} + {roles[0]}
          </span>
          <span aria-hidden className="block">
            <span className="flex items-center gap-5 sm:gap-8">
              <span className="hero-in text-fg" style={{ "--delay": "0.25s" } as React.CSSProperties}>
                {t.hero.role}
              </span>
              <span
                className="hero-line mt-[0.1em] h-px max-w-[22rem] flex-1 bg-faint/60"
                style={{ "--delay": "0.6s" } as React.CSSProperties}
              />
            </span>
            <span className="hero-in flex items-baseline gap-[0.25em] text-[0.82em] sm:text-[1em]" style={{ "--delay": "0.4s" } as React.CSSProperties}>
              <span className="text-faint">+</span>
              {/* Every role in one grid cell (invisible) reserves the widest, so nothing shifts. */}
              <span className="grid">
                {roles.map((r) => (
                  <span key={r} className="invisible col-start-1 row-start-1 whitespace-nowrap">
                    {r}
                  </span>
                ))}
                <DecoderText text={roles[index]} playOnView={false} className="col-start-1 row-start-1 whitespace-nowrap text-muted" />
              </span>
            </span>
          </span>
        </h2>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("projects")}
        aria-label={t.hero.scrollHint}
        className="hero-in absolute bottom-8 left-1/2 grid h-14 w-11 -translate-x-1/2 place-items-center text-muted transition-colors hover:text-fg short:hidden"
        style={{ "--delay": "1.1s" } as React.CSSProperties}
      >
        {/* Mouse outline with a rolling wheel on wide screens, a chevron on touch screens. */}
        <span className="relative hidden h-10 w-6 rounded-full border-2 border-current sm:block">
          <span className="scroll-wheel absolute left-1/2 top-2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-current" />
        </span>
        <ChevronDown className="h-7 w-7 sm:hidden" strokeWidth={1.5} />
      </button>
    </section>
  );
}
