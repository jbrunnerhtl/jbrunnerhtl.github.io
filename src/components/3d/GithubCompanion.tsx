"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GITHUB_MARK_PATH } from "@/components/icons/githubMark";
import { motionStore } from "@/lib/motionStore";
import { sceneLayout, type SceneLayout } from "./sceneLayout";

/** Diameter of the mark in scene units (the orb it replaces was ~2.7 across). */
const MARK_SIZE = 2.7;

/** Extrudes the 24×24 GitHub mark into a centered, bevelled solid. */
function buildMarkGeometry(curveSegments: number) {
  const svg = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${GITHUB_MARK_PATH}"/></svg>`,
  );
  const shapes = svg.paths.flatMap((p) => p.toShapes());
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 2.2,
    curveSegments,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.14,
    // Inset the core by the bevel, so the bevel ends on the outline and thin parts (the tail) keep their shape.
    bevelOffset: -0.14,
    bevelSegments: 4,
  });
  geometry.center();
  // SVG y points down. A half turn about x flips it upright without mirroring the triangle winding.
  geometry.rotateX(Math.PI);
  geometry.scale(MARK_SIZE / 24, MARK_SIZE / 24, MARK_SIZE / 24);
  return geometry;
}

type Pose = { x: number; y: number; z: number; s: number };

/** The companion's place beside the hero text, as an offset in camera space (z forward is negative). */
const HERO: Record<SceneLayout, Pose> = {
  desktop: { x: 1.75, y: 0.3, z: -5.5, s: 0.8 },
  tablet: { x: 2.1, y: 1.0, z: -6.1, s: 0.65 },
  mobile: { x: 0.3, y: 1.7, z: -6.5, s: 0.5 },
};

/** Where it flies off to as the journey starts: far ahead, up and to the right, spinning away. */
const AWAY = { x: 5, y: 3, z: -48 };

/** How quickly the companion follows the camera; the lag this leaves while flying is its "trail". */
const TRAIL = 4;
/** Cap on the trail, so a fast navbar jump never pulls the logo into the lens. */
const MAX_LAG = 1.2;
/** Maximum bank (~8°) and yaw (never edge-on) in radians. */
const MAX_BANK = 0.14;
const MAX_YAW = 0.5;

// Per-frame scratch state (there is only one companion), kept out of React.
const tmp = {
  target: new THREE.Vector3(),
  lag: new THREE.Vector3(),
  local: new THREE.Euler(),
  localQ: new THREE.Quaternion(),
  lean: { x: 0, y: 0, z: 0 },
};

export default function GithubCompanion() {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  // Re-renders only when the layout bucket changes (e.g. rotating a tablet), not on every resize.
  const layout = useThree((s) => sceneLayout(s.size.width, s.size.height));
  const geometry = useMemo(() => buildMarkGeometry(layout === "mobile" ? 8 : 16), [layout]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 1 / 20);
    const t = motionStore.sceneTime;
    const u = motionStore.routeU;
    const { damp, clamp, smoothstep } = THREE.MathUtils;

    // Pure function of the route position: it leaves as you scroll into the journey and flies
    // back in when you scroll up to the hero again.
    const away = smoothstep(u, 0.04, 0.8);
    const hero = HERO[layout];
    const pose = {
      x: hero.x + (AWAY.x - hero.x) * away * away,
      y: hero.y + (AWAY.y - hero.y) * away * away,
      z: hero.z + (AWAY.z - hero.z) * away,
      s: hero.s * (1 - 0.4 * away),
    };
    group.visible = away < 0.995;
    if (materialRef.current) materialRef.current.opacity = 1 - smoothstep(away, 0.75, 0.99);

    // The pose is an offset in camera space, so the companion flies along and turns with the view.
    const cam = state.camera;
    tmp.target.set(pose.x, pose.y + Math.sin(t * 0.6) * 0.06, pose.z).applyQuaternion(cam.quaternion).add(cam.position);
    const k = 1 - Math.exp(-TRAIL * dt);
    group.position.lerp(tmp.target, k);
    tmp.lag.subVectors(group.position, tmp.target);
    if (tmp.lag.length() > MAX_LAG) group.position.copy(tmp.target).add(tmp.lag.setLength(MAX_LAG));
    group.scale.setScalar(damp(group.scale.x, pose.s, 3, dt));

    // Face-on relative to the camera: a slow bounded sway plus the pointer lean, banking with the scroll speed.
    // Face-on while it sits at the hero; it spins as it flies off.
    const yaw = clamp(Math.sin(t * 0.35) * 0.25 + motionStore.pointerX * 0.3, -MAX_YAW, MAX_YAW) + away * Math.PI * 2;
    const bank = clamp(-motionStore.scrollVelocity * 0.004, -MAX_BANK, MAX_BANK);
    tmp.lean.x = damp(tmp.lean.x, -motionStore.pointerY * 0.25, 2.5, dt);
    tmp.lean.y = damp(tmp.lean.y, yaw, 2.5, dt);
    tmp.lean.z = damp(tmp.lean.z, bank, 2.5, dt);
    tmp.localQ.setFromEuler(tmp.local.set(tmp.lean.x, tmp.lean.y, tmp.lean.z));
    group.quaternion.copy(cam.quaternion).multiply(tmp.localQ);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          color="#dfe3ea"
          roughness={0.2}
          metalness={1}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[120, 420]}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}
