"use client";

import React, { createContext, useContext, useState } from "react";
import { flushSync } from "react-dom";
import { LOCALE_COOKIE, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { de } from "./dictionaries/de";
import { BASE_PATH } from "@/lib/basePath";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

// Both dictionaries are small, so they ship to the client. That lets a language switch swap the
// copy in place, with no navigation, so the WebGL scene and scroll position survive.
const DICTIONARIES: Record<Locale, Dictionary> = { en, de };

interface I18nValue {
  lang: Locale;
  t: Dictionary;
  switchLang: (next: Locale) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

/** The same page in another language: /en/projects/rpn/ → /de/projects/rpn/ (base path kept). */
function pathIn(next: Locale) {
  const rest = window.location.pathname.slice(BASE_PATH.length).replace(/^\/(en|de)(?=\/|$)/, "");
  return `${BASE_PATH}/${next}${rest || "/"}`;
}

/** Document title of the current page in another language (project pages carry their own). */
function titleIn(next: Locale) {
  const t = DICTIONARIES[next];
  const slug = window.location.pathname.match(/\/projects\/([^/]+)/)?.[1];
  const project = slug ? t.projects.items[slug as keyof Dictionary["projects"]["items"]] : undefined;
  return project ? `${project.title} — ${PORTFOLIO_DATA.profile.name}` : t.meta.title;
}

export function I18nProvider({ initialLang, children }: { initialLang: Locale; children: React.ReactNode }) {
  const [lang, setLang] = useState(initialLang);

  const switchLang = (next: Locale) => {
    if (next === lang) return;
    // Scoped to the site's path so other GitHub Pages projects on the same domain are unaffected.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=${BASE_PATH || "/"}; max-age=31536000; samesite=lax`;

    const apply = () => {
      flushSync(() => setLang(next));
      const root = document.documentElement;
      root.lang = next;
      document.title = titleIn(next);
      // Keeps the URL shareable; a reload loads the prerendered page in that language.
      window.history.replaceState(null, "", `${pathIn(next)}${window.location.hash}`);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
      apply();
      return;
    }
    // Soft cross-fade of the whole page (see .vt-fade in globals.css).
    const root = document.documentElement;
    root.classList.add("vt-fade");
    document.startViewTransition(apply).finished.finally(() => root.classList.remove("vt-fade"));
  };

  return (
    <I18nContext.Provider value={{ lang, t: DICTIONARIES[lang], switchLang }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
