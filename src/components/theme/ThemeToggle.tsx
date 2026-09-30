"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "@/i18n/I18nProvider";

/** Moon in dark mode, sun in light mode; switches with a cross-fade. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.nav.lightMode : t.nav.darkMode}
      title={dark ? t.nav.lightMode : t.nav.darkMode}
      className={`grid h-11 w-11 place-items-center text-fg transition-colors hover:text-accent-text ${className}`}
    >
      {dark ? <Moon className="h-5 w-5" fill="currentColor" strokeWidth={1.5} /> : <Sun className="h-5 w-5" strokeWidth={1.75} />}
    </button>
  );
}
