/** Camera distance from the scene origin at the top of the page. */
export const CAMERA_START_Z = 5.5;

/** How far the camera flies forward per scrolled pixel. Per pixel (not per progress) so every layout flies at the same pace. */
const UNITS_PER_PX = 0.006;

/** Camera depth for a scroll offset: a pure function, so the same position always shows the same place in space. */
export function flightCameraZ(scrollPx: number) {
  return CAMERA_START_Z - scrollPx * UNITS_PER_PX;
}
