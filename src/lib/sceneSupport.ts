import { isWebGLAvailable } from "./webgl";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/**
 * Search engine and link-preview crawlers: they get the static sphere, not three.js.
 * Lighthouse/PageSpeed are deliberately not matched, so their measurements reflect what visitors get.
 */
const CRAWLER = /bot\b|crawler|spider|googlebot|bingbot|duckduckbot|yandex|baiduspider|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp/i;

/**
 * Skip the 3D sphere (and its ~250 KB of JS) where it would cost more than it adds. Reduced motion
 * still gets it, as a still image.
 */
export function prefersStaticBackground() {
  const nav = navigator as NavigatorHints;
  return (
    CRAWLER.test(navigator.userAgent) ||
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2)
  );
}

let cached: boolean | undefined;

/** Whether this browser gets the 3D hero sphere. Client only; checked once per page load. */
export function canShowScene() {
  cached ??= !prefersStaticBackground() && isWebGLAvailable();
  return cached;
}
