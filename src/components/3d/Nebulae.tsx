"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "./random";
import type { Route } from "./route";

const TEXTURE_SIZE = 128;

/** A soft cloud of fBm value noise with a round falloff, drawn once on a canvas (no download). */
function cloudTexture(seed: number) {
  const random = seededRandom(seed);
  const grid = 8;
  const lattice = Array.from({ length: (grid + 1) * (grid + 1) * 4 }, () => random());
  const noise = (x: number, y: number, octave: number) => {
    const g = grid;
    const xi = Math.floor(x) % g;
    const yi = Math.floor(y) % g;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const at = (i: number, j: number) => lattice[(((j % g) * (g + 1) + (i % g)) * 4 + octave) % lattice.length];
    return (at(xi, yi) * (1 - u) + at(xi + 1, yi) * u) * (1 - v) + (at(xi, yi + 1) * (1 - u) + at(xi + 1, yi + 1) * u) * v;
  };

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const nx = (x / TEXTURE_SIZE) * grid;
      const ny = (y / TEXTURE_SIZE) * grid;
      let value = 0;
      let amp = 0.5;
      for (let o = 0; o < 4; o++) {
        const f = 2 ** o;
        value += amp * noise(nx * f, ny * f, o);
        amp *= 0.5;
      }
      const dx = x / TEXTURE_SIZE - 0.5;
      const dy = y / TEXTURE_SIZE - 0.5;
      const falloff = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2);
      const alpha = Math.max(0, value - 0.35) * 1.8 * falloff * falloff;
      const i = (y * TEXTURE_SIZE + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = 255;
      image.data[i + 3] = Math.min(255, alpha * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type Cloud = { position: THREE.Vector3; scale: number; texture: number; tint: number; opacity: number; rotation: number };

/** Nebula clouds beside the route between the stations; they fade as the camera comes close. */
export default function Nebulae({ route, tints }: { route: Route; tints: string[] }) {
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);
  const textures = useMemo(() => [11, 23, 37].map(cloudTexture), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  const clouds = useMemo<Cloud[]>(() => {
    const random = seededRandom(77);
    const list: Cloud[] = [];
    for (let i = 0; i < route.count - 1; i++) {
      for (let k = 0; k < 2; k++) {
        const t = (i + 0.3 + k * 0.4) / (route.count - 1);
        const position = route.curve.getPoint(t);
        const side = (i + k) % 2 ? 1 : -1;
        position.x += side * (10 + random() * 8);
        position.y += (random() - 0.5) * 10;
        list.push({
          position,
          scale: 20 + random() * 20,
          texture: Math.floor(random() * 3),
          tint: Math.floor(random() * tints.length),
          opacity: 0.35 + random() * 0.3,
          rotation: random() * Math.PI * 2,
        });
      }
    }
    return list;
  }, [route, tints.length]);

  useFrame((state) => {
    const cam = state.camera.position;
    clouds.forEach((cloud, i) => {
      const sprite = spriteRefs.current[i];
      if (!sprite) return;
      // No flat quad ever cuts through the lens.
      const d = sprite.position.distanceTo(cam) - cloud.scale * 0.3;
      (sprite.material as THREE.SpriteMaterial).opacity = cloud.opacity * THREE.MathUtils.smoothstep(d, 2, 12);
    });
  });

  return (
    <group>
      {clouds.map((cloud, i) => (
        <sprite
          key={i}
          ref={(el) => {
            spriteRefs.current[i] = el;
          }}
          position={cloud.position}
          scale={[cloud.scale, cloud.scale, 1]}
        >
          <spriteMaterial
            map={textures[cloud.texture]}
            color={tints[cloud.tint]}
            rotation={cloud.rotation}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
