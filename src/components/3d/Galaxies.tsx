"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionStore } from "@/lib/motionStore";
import { galaxyKind, galaxySide, type GalaxyKind, type GalaxySide } from "@/lib/stationGalaxies";
import { GALAXIES } from "./spaceTheme";
import { seededRandom } from "./random";
import { waypointFrame, type Route } from "./route";
import type { SceneLayout } from "./sceneLayout";

// A galaxy is a disc of points in unit space (the group scales it). The disc turns
// differentially: inner stars go round faster than the rim, so the arms slowly wind.
const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uScale;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(position.xz);
    float a = atan(position.z, position.x) + uTime / (0.25 + r);
    vec3 p = vec3(cos(a) * r, position.y, sin(a) * r);
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uScale / -mv.z, 1.0, 48.0);
    // Stars fade out right in front of the lens when the route passes through a galaxy's rim.
    vAlpha = aAlpha * uOpacity * smoothstep(1.0, 5.0, length(world.xyz - cameraPosition));
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float core = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));
    float a = core * core * vAlpha;
    if (a <= 0.003) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

/** Rough gaussian from three uniforms, in about -1..1. */
const gauss = (random: () => number) => (random() + random() + random() - 1.5) / 1.5;

/** Positions, colours and sizes of one galaxy's stars, in unit space. Deterministic per seed. */
function buildGalaxy(kind: GalaxyKind, count: number, seed: number) {
  const g = GALAXIES[kind];
  const random = seededRandom(seed);
  const core = new THREE.Color(g.core);
  const inner = new THREE.Color(g.inner);
  const outer = new THREE.Color(g.outer);
  const sparkle = new THREE.Color("#ff9ed8");
  const color = new THREE.Color();
  const { smoothstep } = THREE.MathUtils;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    let z: number;
    let rn: number;
    if (g.arms === 0) {
      // Elliptical: a smooth, flattened ball of old stars, dense in the middle.
      rn = Math.pow(random(), 2.2);
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      x = rn * Math.sin(phi) * Math.cos(theta);
      y = rn * Math.cos(phi) * 0.55;
      z = rn * Math.sin(phi) * Math.sin(theta) * 0.8;
    } else if (g.bar && random() < 0.16) {
      // Central bar of a barred spiral; the arms start at its ends.
      x = (random() * 2 - 1) * 0.3;
      z = gauss(random) * 0.05;
      y = gauss(random) * 0.02;
      rn = Math.abs(x);
    } else if (random() < 0.3) {
      // Disc: stars between the arms, densest towards the middle, so the galaxy has a glowing body.
      rn = Math.min(-Math.log(1 - random() * 0.98) * 0.28, 1);
      const angle = random() * Math.PI * 2;
      x = Math.cos(angle) * rn;
      z = Math.sin(angle) * rn;
      y = gauss(random) * 0.04 * (1 - 0.7 * rn);
    } else {
      // Spiral arms: stars cluster along logarithmic-ish arms, more scattered towards the core.
      rn = Math.pow(random(), 1.5);
      const r = (g.bar ? 0.28 + rn * 0.72 : rn) + (random() - 0.5) * 0.09;
      const arm = i % g.arms;
      const angle = (arm / g.arms) * Math.PI * 2 + r * g.twist + gauss(random) * (0.25 + 0.4 * (1 - r));
      x = Math.cos(angle) * r;
      z = Math.sin(angle) * r;
      y = gauss(random) * 0.045 * (1 - 0.7 * r);
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    color.copy(core).lerp(inner, smoothstep(rn, 0, 0.18)).lerp(outer, smoothstep(rn, 0.2, 0.95));
    const kind = random();
    if (rn < 0.08) {
      // Core: many overlapping stars, so each one is faint to keep the colour instead of burning white.
      sizes[i] = 0.25 + random() * 0.2;
      alphas[i] = 0.22;
    } else if (kind < 0.25) {
      // Haze: large, very faint points that give the arms their soft coloured glow.
      sizes[i] = 1 + random() * 1.3;
      alphas[i] = 0.09;
      color.lerp(outer, 0.35);
    } else {
      sizes[i] = 0.12 + random() * 0.18;
      alphas[i] = 0.6;
      // A few bright star-forming knots along the arms.
      if (g.arms > 0 && rn > 0.3 && kind > 0.96) color.lerp(sparkle, 0.6);
    }
    color.toArray(colors, i * 3);
  }
  return { positions, colors, sizes, alphas };
}

/** Soft round glow for the galaxy cores, drawn once on a canvas (no download). */
function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Galaxies appear only as the route approaches them, instead of all lining up far ahead. */
const FADE_NEAR = 50;
const FADE_FAR = 70;

function Galaxy({
  kind,
  position,
  quaternion,
  radius,
  count,
  seed,
  glow,
}: {
  kind: GalaxyKind;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  radius: number;
  count: number;
  seed: number;
  glow: THREE.Texture;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const coreRef = useRef<THREE.SpriteMaterial>(null!);
  const stars = useMemo(() => buildGalaxy(kind, count, seed), [kind, count, seed]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uScale: { value: 1 }, uOpacity: { value: 0 } }), []);
  const g = GALAXIES[kind];

  useFrame((state) => {
    const group = groupRef.current;
    const m = materialRef.current;
    if (!group || !m) return;
    const opacity = 1 - THREE.MathUtils.smoothstep(state.camera.position.distanceTo(position), FADE_NEAR, FADE_FAR);
    group.visible = opacity > 0.005;
    if (!group.visible) return;
    m.uniforms.uOpacity.value = opacity;
    m.uniforms.uTime.value = motionStore.sceneTime * 0.05;
    m.uniforms.uScale.value = state.size.height * state.viewport.dpr * 0.5;
    if (coreRef.current) coreRef.current.opacity = opacity * 0.55;
  });

  return (
    <group ref={groupRef} position={position} quaternion={quaternion} scale={radius} visible={false}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[stars.colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[stars.sizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[stars.alphas, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <sprite scale={[g.arms === 0 ? 1 : 0.55, g.arms === 0 ? 1 : 0.55, 1]}>
        <spriteMaterial
          ref={coreRef}
          map={glow}
          color={g.inner}
          transparent
          depthWrite={false}
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

/** Galaxy placement in its station's waypoint frame: sideways (times the side), up, ahead; and radius. */
const PLACEMENT: Record<SceneLayout, { x: number; y: number; z: number; radius: number; count: number }> = {
  desktop: { x: 15.5, y: 1, z: 34, radius: 17, count: 11000 },
  tablet: { x: 13, y: 2, z: 34, radius: 14, count: 8000 },
  mobile: { x: 3, y: 9, z: 34, radius: 10, count: 4000 },
};
/** The destination galaxy spreads out above the Contact content. */
const DESTINATION: Record<SceneLayout, [number, number, number]> = {
  desktop: [0, 9, 52],
  tablet: [0, 9, 52],
  mobile: [0, 12, 52],
};

const SIDE: Record<GalaxySide, number> = { left: -1, right: 1, center: 0 };

/** One galaxy per station after the hero, on its station's side of the route. */
export default function Galaxies({
  route,
  names,
  layout,
}: {
  route: Route;
  names: string[];
  layout: SceneLayout;
}) {
  const glow = useMemo(() => glowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);

  const galaxies = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const list: { key: string; kind: GalaxyKind; position: THREE.Vector3; quaternion: THREE.Quaternion; radius: number; seed: number }[] = [];
    names.forEach((name, i) => {
      const side = galaxySide(i, name);
      if (!side) return;
      const { position, forward, right, up: frameUp } = waypointFrame(route, i);
      const { x, y, z, radius } = PLACEMENT[layout];
      const s = SIDE[side];
      const [px, py, pz] = side === "center" ? DESTINATION[layout] : [x * s, y, z];
      position.addScaledVector(right, px).addScaledVector(frameUp, py).addScaledVector(forward, pz);
      // Tilt the disc towards the viewer (and a little towards the route), so the spiral reads.
      const normal = new THREE.Vector3()
        .addScaledVector(forward, -0.85)
        .addScaledVector(frameUp, 0.45)
        .addScaledVector(right, -0.2 * s)
        .normalize();
      list.push({
        key: name,
        kind: galaxyKind(name),
        position,
        quaternion: new THREE.Quaternion().setFromUnitVectors(up, normal),
        radius: side === "center" ? radius * 1.5 : radius,
        seed: 100 + i * 17,
      });
    });
    return list;
  }, [route, names, layout]);

  const { count } = PLACEMENT[layout];
  return (
    <>
      {galaxies.map(({ key, ...g }) => (
        <Galaxy key={key} {...g} count={count} glow={glow} />
      ))}
    </>
  );
}
