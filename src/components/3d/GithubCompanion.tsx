"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GITHUB_MARK_PATH } from "@/components/icons/githubMark";
import { motionStore } from "@/lib/motionStore";
import { CAMERA_START_Z } from "./flight";
import { POSES, samplePose, sceneLayout } from "./sceneLayout";

/** Diameter of the mark in scene units (the orb it replaces was ~2.7 across). */
const MARK_SIZE = 2.7;

/** Extrudes the 24×24 GitHub mark into a centered, bevelled solid. */
function buildMarkGeometry(curveSegments: number) {
  const svg = new SVGLoader().parse(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${GITHUB_MARK_PATH}"/></svg>`,
  );
  const shapes = svg.paths.flatMap((p) => SVGLoader.createShapes(p));
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

/** How quickly the companion follows the camera; the lag this leaves while flying is its "trail". */
const TRAIL = 4;
/** Cap on the trail in depth, so a fast navbar jump never pulls the logo into the lens. */
const MAX_LAG = 0.8;
/** Maximum bank (~8°) and yaw (never edge-on) in radians. */
const MAX_BANK = 0.14;
const MAX_YAW = 0.5;

export default function GithubCompanion() {
  const groupRef = useRef<THREE.Group>(null!);
  // Re-renders only when the layout bucket changes (e.g. rotating a tablet), not on every resize.
  const layout = useThree((s) => sceneLayout(s.size.width, s.size.height));
  const geometry = useMemo(() => buildMarkGeometry(layout === "mobile" ? 8 : 16), [layout]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 1 / 20);
    const t = motionStore.sceneTime;
    const { damp, clamp } = THREE.MathUtils;

    const pose = samplePose(POSES[layout], motionStore.scrollProgress);
    // Wider screens than the layout was tuned for: push the companion further out so it stays at the edge.
    const aspect = state.viewport.aspect;
    if (layout === "desktop") pose.x *= Math.min(Math.max(aspect / 1.45, 1), 1.6);
    if (layout === "mobile") pose.x *= Math.min(Math.max(aspect / 0.46, 1), 1.8);

    // The pose is an offset from the camera, so the companion flies along with it.
    const cam = state.camera.position;
    const targetZ = cam.z - CAMERA_START_Z + pose.z;
    group.position.x = damp(group.position.x, cam.x + pose.x, 3, dt);
    group.position.y = damp(group.position.y, cam.y + pose.y + Math.sin(t * 0.6) * 0.06, 3, dt);
    group.position.z = clamp(damp(group.position.z, targetZ, TRAIL, dt), targetZ - MAX_LAG, targetZ + MAX_LAG);
    group.scale.setScalar(damp(group.scale.x, pose.s, 3, dt));

    // Face-on: a slow bounded sway plus the pointer lean, banking gently with the scroll speed.
    const yaw = clamp(Math.sin(t * 0.35) * 0.25 + motionStore.pointerX * 0.3, -MAX_YAW, MAX_YAW);
    const bank = clamp(-motionStore.scrollVelocity * 0.004, -MAX_BANK, MAX_BANK);
    group.rotation.x = damp(group.rotation.x, -motionStore.pointerY * 0.25, 2.5, dt);
    group.rotation.y = damp(group.rotation.y, yaw, 2.5, dt);
    group.rotation.z = damp(group.rotation.z, bank, 2.5, dt);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
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
