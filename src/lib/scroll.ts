/** Section ids of the home page, in navigation order. */
export const NAV_SECTIONS = ["projects", "about", "skills", "contact"] as const;
export type NavSection = (typeof NAV_SECTIONS)[number];

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls natively to a home-page section (smoothly, or instantly with reduced motion) and moves
 * focus there, so keyboard and screen reader users continue from the section. Returns false when
 * the section isn't on this page.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}
