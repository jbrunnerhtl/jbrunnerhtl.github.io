"use client";

import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionStore } from "@/lib/motionStore";
import { seededRandom } from "./random";

/** Half size of the box of stars kept around the camera. */
const H = 30;

// Every star is wrapped into a box around the camera on all three axes, so the field never runs
// out in any direction. Stars fade in at the box edge and out before the lens.
const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute vec2 aTwinkle;
  uniform vec3 uCam;
  uniform float uH;
  uniform float uScale;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 rel = mod(position - uCam, 2.0 * uH) - uH;
    vec4 mv = modelViewMatrix * vec4(uCam + rel, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(aSize * uScale / -mv.z, 1.0);
    float dist = length(rel);
    float twinkle = 0.7 + 0.3 * sin(uTime * aTwinkle.x + aTwinkle.y);
    vAlpha = smoothstep(1.5, 4.0, dist) * (1.0 - smoothstep(uH * 0.7, uH, dist)) * twinkle;
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float core = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));
    float a = core * core * vAlpha * uOpacity;
    if (a <= 0.003) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

export default function Starfield({
  count,
  colors,
}: {
  count: number;
  colors: [string, string, string];
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const attributes = useMemo(() => {
    const random = seededRandom(1102);
    const palette = colors.map((c) => new THREE.Color(c));
    const positions = new Float32Array(count * 3);
    const tints = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkle = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = random() * 2 * H;
      positions[i * 3 + 1] = random() * 2 * H;
      positions[i * 3 + 2] = random() * 2 * H;
      const r = random();
      palette[r < 0.7 ? 0 : r < 0.9 ? 1 : 2].toArray(tints, i * 3);
      // Mostly small stars, a few bright ones.
      sizes[i] = random() < 0.95 ? 0.035 + random() * 0.045 : 0.12 + random() * 0.1;
      twinkle[i * 2] = 0.6 + random() * 2.2;
      twinkle[i * 2 + 1] = random() * Math.PI * 2;
    }
    return { positions, tints, sizes, twinkle };
  }, [count, colors]);

  // Created once; updated through the material ref, so render stays pure.
  const [uniforms] = useState(() => ({
    uCam: { value: new THREE.Vector3() },
    uH: { value: H },
    uScale: { value: 1 },
    uTime: { value: 0 },
    uOpacity: { value: 1 },
  }));

  useFrame((state) => {
    const m = materialRef.current;
    if (!m) return;
    m.uniforms.uCam.value.copy(state.camera.position);
    m.uniforms.uTime.value = motionStore.sceneTime;
    // Matches three's size attenuation: world size → px at depth 1.
    m.uniforms.uScale.value = state.size.height * state.viewport.dpr * 0.5;
  });

  return (
    // Positions are moved on the GPU, so the CPU-side bounds are meaningless.
    <points frustumCulled={false}>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[attributes.tints, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[attributes.twinkle, 2]} />
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
  );
}
