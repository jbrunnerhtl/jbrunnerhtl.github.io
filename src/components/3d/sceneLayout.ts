export type SceneLayout = "mobile" | "tablet" | "desktop";

/** Chooses the scene's per-layout sizes and placements from the canvas size in CSS px. */
export function sceneLayout(width: number, height: number): SceneLayout {
  if (width / height < 0.9) return "mobile";
  if (width < 1280 || width / height < 1.4) return "tablet";
  return "desktop";
}
