/**
 * Every station after the hero has its own galaxy. It sits on one side of the view and the
 * station's content on the other, alternating along the route; the destination is centred.
 * Shared by the DOM (layout via [data-galaxy]) and the 3D scene (placement), so they agree.
 */
export type GalaxySide = "left" | "right" | "center";

export function galaxySide(index: number, name: string): GalaxySide | null {
  if (index === 0) return null;
  if (name === "contact") return "center";
  return index % 2 ? "right" : "left";
}

export type GalaxyKind =
  | "ember"
  | "azure"
  | "violet"
  | "teal"
  | "rose"
  | "gold"
  | "cyan"
  | "lime"
  | "elliptical"
  | "barred"
  | "destination";

const PROJECT_GALAXIES: GalaxyKind[] = ["violet", "teal", "rose", "gold", "cyan", "lime"];

export function galaxyKind(name: string): GalaxyKind {
  if (name === "stats") return "ember";
  if (name === "about") return "azure";
  if (name === "projects-more") return "elliptical";
  if (name === "skills") return "barred";
  if (name === "contact") return "destination";
  const project = /^projects-(\d+)$/.exec(name);
  if (project) return PROJECT_GALAXIES[(Number(project[1]) - 1) % PROJECT_GALAXIES.length];
  return "violet";
}
