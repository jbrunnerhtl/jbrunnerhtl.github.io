"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Monogram from "./Monogram";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { NAV_SECTIONS, scrollToSection, type NavSection } from "@/lib/scroll";
import { useI18n } from "@/i18n/I18nProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const isHomePath = (pathname: string) => /^\/(en|de)\/?$/.test(pathname);

/**
 * The section in the middle band of the viewport, from the [data-nav] marker on each home-page
 * section (the hero has an empty one, so nothing is active there).
 */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.nav || null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-nav]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

/**
 * A section link: on the home page it scrolls there natively; elsewhere it is a normal link to
 * /<lang>/#id, so the home page opens at that section.
 */
function SectionLink({
  id,
  onHome,
  onNavigate,
  className,
  children,
  ...rest
}: {
  id: NavSection;
  onHome: boolean;
  onNavigate?: () => void;
  className?: string;
  children: React.ReactNode;
} & React.AriaAttributes) {
  const { lang } = useI18n();
  return (
    <Link
      href={`/${lang}/#${id}`}
      scroll={!onHome}
      onClick={(e) => {
        onNavigate?.();
        if (!onHome || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (scrollToSection(id)) e.preventDefault();
      }}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}

function SocialLinks({ className = "", itemClassName = "" }: { className?: string; itemClassName?: string }) {
  const { t } = useI18n();
  const { githubUrl, email } = PORTFOLIO_DATA.profile;
  return (
    <div className={className}>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={t.nav.github} className={itemClassName}>
        <GithubIcon className="h-5 w-5" />
      </a>
      <a href={`mailto:${email}`} aria-label={t.nav.email} className={itemClassName}>
        <Mail className="h-5 w-5" strokeWidth={1.75} />
      </a>
    </div>
  );
}

/** Full-screen menu for narrow screens: focus stays inside, Escape and link clicks close it. */
function MobileMenu({ onHome, active, onClose }: { onHome: boolean; active: string | null; onClose: () => void }) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && onClose();
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panel}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.sections}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 lg:hidden"
    >
      <nav aria-label={t.nav.sections} className="my-auto">
        <ul className="space-y-2">
          {NAV_SECTIONS.map((id, i) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease: EASE }}
            >
              <SectionLink
                id={id}
                onHome={onHome}
                onNavigate={onClose}
                aria-current={active === id ? "location" : undefined}
                className={`flex min-h-14 items-center gap-4 text-[clamp(2.25rem,11vw,3.5rem)] font-semibold tracking-tight transition-colors ${
                  active === id ? "text-accent-text" : "text-fg hover:text-accent-text"
                }`}
              >
                <span className="font-mono text-sm font-normal text-faint">0{i + 1}</span>
                {t.nav[id]}
              </SectionLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
      >
        <SocialLinks className="flex gap-2" itemClassName="grid h-11 w-11 place-items-center text-muted transition-colors hover:text-fg" />
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Site navigation. Wide screens: a fixed sidebar (monogram, vertical section links, social icons)
 * plus language and color mode controls in the top right corner. Narrow screens: a top bar with the
 * monogram and a menu button that opens a full-screen menu.
 */
export default function Sidebar() {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const onHome = isHomePath(pathname);
  const active = useActiveSection(onHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A navigation (e.g. the browser's back button) closes the menu.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const home = (
    <Link
      href={`/${lang}/`}
      aria-label={t.nav.home}
      onClick={(e) => {
        setMenuOpen(false);
        if (!onHome || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }}
      className="grid min-h-11 min-w-11 place-items-center text-fg"
    >
      <Monogram />
    </Link>
  );

  return (
    <>
      {/* Wide screens: sidebar. */}
      <header className="fixed inset-y-0 left-0 z-40 hidden w-24 flex-col items-center py-10 lg:flex">
        {home}
        <nav aria-label={t.nav.sections} className="mt-14">
          <ul className="flex flex-col items-center gap-10">
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <SectionLink
                  id={id}
                  onHome={onHome}
                  aria-current={active === id ? "location" : undefined}
                  className={`nav-vertical text-[0.9375rem] font-medium tracking-wide transition-colors duration-300 ${
                    active === id ? "text-accent-text" : "text-fg hover:text-accent-text"
                  }`}
                >
                  {t.nav[id]}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks
          className="mt-auto flex flex-col items-center gap-3"
          itemClassName="grid h-10 w-10 place-items-center text-muted transition-colors hover:text-accent-text"
        />
      </header>

      {/* Wide screens: language and color mode, top right. */}
      <div className="fixed right-8 top-8 z-40 hidden items-center gap-2 lg:flex">
        <LanguageSwitch />
        <ThemeToggle />
      </div>

      {/* Narrow screens: top bar with menu button. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3 pt-[env(safe-area-inset-top)] transition-colors duration-300 sm:px-5 lg:hidden ${
          scrolled && !menuOpen ? "bg-bg/95 shadow-[0_1px_0_var(--line)]" : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center">{home}</div>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          className="grid h-11 w-11 place-items-center text-fg"
        >
          {/* Three lines that fold into an X. */}
          <span className="relative block h-3.5 w-6">
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all duration-500 ease-out-expo ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onHome={onHome} active={active} onClose={closeMenu} />}
      </AnimatePresence>
    </>
  );
}
