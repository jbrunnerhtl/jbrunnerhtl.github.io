/**
 * Mutable, render-free motion state shared between the DOM and the WebGL scene.
 * Written by the scroll provider / pointer listener, read inside useFrame.
 * Keeping this out of React state means scrolling never triggers re-renders.
 */
export const motionStore = {
  /** 0 at top of page, 1 at bottom (smoothed by Lenis). */
  scrollProgress: 0,
  /** Smoothed scroll offset in px. */
  scrollPx: 0,
  /** Lenis scroll velocity in px/frame. */
  scrollVelocity: 0,
  /** Normalized pointer, -1..1 on both axes (y up). */
  pointerX: 0,
  pointerY: 0,
  /**
   * Animation clock for the 3D scene. Advances only on rendered frames (by a clamped delta),
   * so pausing the render loop freezes the orb instead of making it jump when it resumes.
   */
  sceneTime: 0,
};
