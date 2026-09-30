/** Colours of the space world (the site only has a dark mode). */
export const SPACE = {
  sky: "#04050b",
  nebulaA: "#3b2a78",
  nebulaB: "#0f3d66",
  skyStars: "#ffffff",
  stars: ["#ffffff", "#cfe0ff", "#ffd9a8"] as [string, string, string],
  nebulae: ["#7c5cff", "#2f8fff", "#ff5ca8", "#34d3c8"],
};

import type { GalaxyKind } from "@/lib/stationGalaxies";

/**
 * Galaxy looks: colours from the bright core out to the rim, the number of spiral arms (0 for an
 * elliptical galaxy), how far the arms wind, and a central bar.
 */
export const GALAXIES: Record<GalaxyKind, { core: string; inner: string; outer: string; arms: number; twist: number; bar?: boolean }> = {
  ember: { core: "#fff4d6", inner: "#ffb347", outer: "#ff4d2e", arms: 2, twist: 4.2 },
  azure: { core: "#ffffff", inner: "#9fd8ff", outer: "#3b5bff", arms: 4, twist: 3.4 },
  violet: { core: "#fdeaff", inner: "#d8a8ff", outer: "#6d28d9", arms: 3, twist: 3.8 },
  teal: { core: "#eafffb", inner: "#5eead4", outer: "#0e7490", arms: 2, twist: 5 },
  rose: { core: "#fff0f5", inner: "#fda4af", outer: "#be123c", arms: 3, twist: 3.2 },
  gold: { core: "#fffbe6", inner: "#fde68a", outer: "#c2410c", arms: 4, twist: 2.8 },
  cyan: { core: "#f0fdff", inner: "#67e8f9", outer: "#1d4ed8", arms: 2, twist: 3.6 },
  lime: { core: "#f7ffe6", inner: "#bef264", outer: "#15803d", arms: 3, twist: 4.4 },
  elliptical: { core: "#fff1e0", inner: "#f5c39a", outer: "#9a3412", arms: 0, twist: 0 },
  barred: { core: "#ffffff", inner: "#c7d2fe", outer: "#4f46e5", arms: 2, twist: 3, bar: true },
  destination: { core: "#fff5ff", inner: "#f0abfc", outer: "#7c3aed", arms: 3, twist: 4.6 },
};
