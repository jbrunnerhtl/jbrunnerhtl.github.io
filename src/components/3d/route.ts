import * as THREE from "three";

/** Distance between two stations along the route. */
const SPACING = 42;

export type Route = {
  curve: THREE.CatmullRomCurve3;
  /** One waypoint per station; station i sits at curve parameter i / (count - 1). */
  points: THREE.Vector3[];
  count: number;
};

/** A straight route into the depth of space with one evenly spaced waypoint per station. */
export function buildRoute(stationCount: number): Route {
  const count = Math.max(stationCount, 2);
  const points = Array.from({ length: count }, (_, i) => new THREE.Vector3(0, 0, -i * SPACING));
  // Evenly spaced collinear points: getPoint(i / (count - 1)) is exactly waypoint i.
  return { curve: new THREE.CatmullRomCurve3(points, false, "centripetal"), points, count };
}

/** Position and orthonormal frame (forward, right, up) of the route at waypoint i. */
export function waypointFrame(route: Route, i: number) {
  const t = route.count > 1 ? i / (route.count - 1) : 0;
  const position = route.curve.getPoint(t);
  const forward = route.curve.getTangent(t).normalize();
  const right = new THREE.Vector3().crossVectors(forward, THREE.Object3D.DEFAULT_UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  return { position, forward, right, up };
}
