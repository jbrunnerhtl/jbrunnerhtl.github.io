import { isWebGLAvailable } from "./webgl";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

/** Skip the 3D scene (and its ~250 KB of JS) where it would cost more than it adds. */
export function prefersStaticBackground() {
  const nav = navigator as NavigatorHints;
  return (
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
