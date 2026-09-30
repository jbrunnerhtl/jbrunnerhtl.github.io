"use client";

import React from "react";
import { motion } from "framer-motion";
import { LOCALES, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { localePath } from "@/lib/basePath";

const NATIVE_NAME: Record<Locale, string> = { en: "English", de: "Deutsch" };

/** DE | EN pill. Swaps the copy in place, so the page, the 3D scene and the scroll position stay put. */
export default function LanguageSwitch() {
  const { lang, t, switchLang } = useI18n();

  return (
    <div role="group" aria-label={t.nav.language} className="relative flex items-center rounded-full border border-line p-0.5">
      {LOCALES.map((l) => {
        const active = l === lang;
        return (
          // Real links, so middle-click / "open in new tab" and no-JS still work.
          <a
            key={l}
            href={localePath(l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            aria-label={NATIVE_NAME[l]}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              switchLang(l);
            }}
            className={`relative grid h-8 min-w-9 place-items-center rounded-full px-2 font-mono text-[11px] uppercase tracking-wider transition-colors duration-300 md:h-7 coarse:h-11 coarse:min-w-11 ${
              active ? "text-fg" : "text-faint hover:text-fg"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-fg/[0.08]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{l}</span>
          </a>
        );
      })}
    </div>
  );
}
