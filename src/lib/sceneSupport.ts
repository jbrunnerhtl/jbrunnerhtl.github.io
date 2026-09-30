import { isWebGLAvailable } from "./webgl";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/**
 * Search engine and link-preview crawlers. They get the stacked page (the same content, all of it in
 * normal flow) instead of the journey, where every station but one is hidden. Lighthouse/PageSpeed
 * are deliberately not matched, so their measurements reflect what visitors get.
 */
const CRAWLER = /bot\b|crawler|spider|googlebot|bingbot|duckduckbot|yandex|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp/i;

/** Skip the 3D scene (and its ~250 KB of JS) where it would cost more than it adds. */
export function prefersStaticBackground() {
  const nav = navigator as NavigatorHints;
  return (
    CRAWLER.test(navigator.userAgent) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)
  );
}

let cached: boolean | undefined;

/**
 * Whether this browser gets the 3D scene, and with it the station journey.
 * Client only; checked once per page load.
 */
export function canShowScene() {
  cached ??= !prefersStaticBackground() && isWebGLAvailable();
  return cached;
}
