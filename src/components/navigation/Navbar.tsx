"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import { useScrollTo } from "@/components/providers/SmoothScrollProvider";
import { useJourney } from "@/components/journey/JourneyProvider";
import { journeyStore } from "@/lib/journeyStore";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import { useI18n } from "@/i18n/I18nProvider";

const NAV_ITEMS = ["about", "projects", "skills", "contact"] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const scrollTo = useScrollTo();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const journey = useJourney();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Space journey: the section whose station is being held is active (none at the hero).
    if (journey) {
      const unsubscribe = journeyStore.subscribe(() => setActive(journeyStore.activeSection));
      return () => {
        window.removeEventListener("scroll", onScroll);
        unsubscribe();
      };
    }

    // Stacked page: mark whichever section crosses the middle band of the viewport as active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "hero" ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["hero", ...NAV_ITEMS].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [journey]);

  // Close the mobile menu on Escape or when the layout grows past the breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  const solid = scrolled || menuOpen;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4"
    >
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border py-1.5 pl-2 pr-1.5 transition-[background-color,border-color] duration-500 sm:px-3 sm:py-2 ${
          solid ? "border-line bg-bg/75 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <button
          type="button"
          onClick={() => go("hero")}
          className="flex items-center gap-2.5 rounded-full px-1 py-1 text-sm font-medium text-fg sm:px-2"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-fg text-[11px] font-bold text-bg sm:h-7 sm:w-7">
            JB
          </span>
          <span className="max-[359px]:hidden">{PORTFOLIO_DATA.profile.name}</span>
        </button>

        <nav className="hidden items-center md:flex" aria-label={t.nav.sections}>
          {NAV_ITEMS.map((id) => (
            <button
              type="button"
              key={id}
              onClick={() => go(id)}
              className={`group relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300 lg:px-4 ${
                active === id ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-tint/[0.07]"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">
                {t.nav[id]}
                {/* Underline draws in from the left on hover and exits to the right on leave. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
              </span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <a
            href={PORTFOLIO_DATA.profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:text-fg sm:grid md:h-8 md:w-8"
            aria-label={t.nav.github}
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <LanguageSwitch />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-tint/[0.06] md:hidden"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {/* Two lines that fold into an X. */}
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-all duration-500 ease-out-expo ${
                  menuOpen ? "top-[5px] rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 rounded bg-current transition-all duration-500 ease-out-expo ${
                  menuOpen ? "top-[5px] -rotate-45" : "top-[9px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Tap outside to close. */}
            <motion.button
              type="button"
              aria-label={t.nav.closeMenu}
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 -z-10 bg-bg/40 md:hidden"
            />
            <motion.nav
              id="mobile-menu"
              aria-label={t.nav.sections}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mt-2 max-h-[calc(100svh-5rem)] w-full max-w-6xl origin-top overflow-y-auto rounded-[1.25rem] border border-line bg-bg p-2 shadow-2xl shadow-black/20 md:hidden"
            >
              <ul>
                {NAV_ITEMS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.04 * i + 0.05, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={() => go(id)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-lg font-medium transition-colors ${
                        active === id ? "bg-tint/[0.06] text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {t.nav[id]}
                      <span className="font-mono text-xs text-faint">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <a
                href={PORTFOLIO_DATA.profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-between border-t border-line px-4 py-3.5 text-sm text-muted transition-colors hover:text-fg"
              >
                <span className="flex items-center gap-2">
                  <GithubIcon className="h-4 w-4" /> @{PORTFOLIO_DATA.profile.handle}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
