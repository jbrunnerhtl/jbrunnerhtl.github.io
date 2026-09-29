import * as THREE from "three";

/** Companion pose as an offset from the camera (z = 0 means the distance the camera starts at). */
export type Pose = { x: number; y: number; z: number; s: number };

// Keyframes along the page (scroll progress 0..1). Interpolated with smoothstep.
// Past the hero the content spans nearly the full width, so the companion drops back and glides
// along the right edge, peeking in from the margin; it never crosses the text. At Contact it
// returns to the centre behind the card, as the end of the flight.
const DESKTOP: [number, Pose][] = [
  [0.0, { x: 1.75, y: 0.3, z: 0, s: 0.8 }],
  [0.3, { x: 4.3, y: 0.9, z: -3, s: 0.6 }],
  [0.6, { x: 4.3, y: -0.6, z: -3.2, s: 0.55 }],
  [0.85, { x: 4.3, y: -0.2, z: -3.2, s: 0.55 }],
  [1.0, { x: 0, y: -0.3, z: -1.5, s: 0.8 }],
];
// Tablets and small laptops: tucked into the top-right corner, then along the right edge.
const TABLET: [number, Pose][] = [
  [0.0, { x: 2.1, y: 1.0, z: -0.6, s: 0.65 }],
  [0.3, { x: 3.6, y: 0.9, z: -2.6, s: 0.5 }],
  [0.6, { x: 3.6, y: -0.6, z: -2.8, s: 0.5 }],
  [0.85, { x: 3.6, y: -0.2, z: -2.8, s: 0.5 }],
  [1.0, { x: 0, y: -0.3, z: -1.6, s: 0.7 }],
];
// Portrait phones and tablets: above the headline, then half off-screen at the right edge.
const MOBILE: [number, Pose][] = [
  [0.0, { x: 0.3, y: 1.7, z: -1, s: 0.5 }],
  [0.35, { x: 1.7, y: 0.8, z: -2.2, s: 0.45 }],
  [0.7, { x: 1.7, y: -0.6, z: -2.2, s: 0.45 }],
  [0.85, { x: 1.7, y: -0.2, z: -2.2, s: 0.45 }],
  [1.0, { x: 0, y: -0.2, z: -1.6, s: 0.6 }],
];

export type SceneLayout = "mobile" | "tablet" | "desktop";

/** Chooses the choreography from the canvas size in CSS px. */
export function sceneLayout(width: number, height: number): SceneLayout {
  if (width / height < 0.9) return "mobile";
  if (width < 1280 || width / height < 1.4) return "tablet";
  return "desktop";
}

export const POSES: Record<SceneLayout, [number, Pose][]> = { mobile: MOBILE, tablet: TABLET, desktop: DESKTOP };

export function samplePose(frames: [number, Pose][], t: number): Pose {
  for (let i = 0; i < frames.length - 1; i++) {
    const [t0, a] = frames[i];
    const [t1, b] = frames[i + 1];
    if (t <= t1) {
      const k = THREE.MathUtils.smoothstep(t, t0, t1);
      return {
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        z: a.z + (b.z - a.z) * k,
        s: a.s + (b.s - a.s) * k,
      };
    }
  }
  return { ...frames[frames.length - 1][1] };
}
