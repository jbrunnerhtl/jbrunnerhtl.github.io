"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionStore } from "@/lib/motionStore";

interface ParticleFieldProps {
  count?: number;
  color?: string;
}

// Deterministic PRNG (mulberry32) so the layout is stable and render stays pure.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Depth of the corridor ahead of the camera; particles leaving it behind re-enter at the far end. */
const LENGTH = 36;
/** Clear radius around the flight axis, so nothing passes through the middle of the screen. */
const R_MIN = 0.9;
const R_MAX = 10;

// Each particle is wrapped to a distance d ahead of the camera, so the field never runs out.
// It is invisible at both ends of the corridor (the fades), which hides the wrap jump.
const vertexShader = /* glsl */ `
  attribute float aSize;
  uniform float uCamZ;
  uniform float uLength;
  uniform float uScale;
  varying float vAlpha;

  void main() {
    float d = mod(position.z + uCamZ, uLength);
    vec4 mv = modelViewMatrix * vec4(position.xy, uCamZ - 0.3 - d, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(aSize * uScale / -mv.z, 1.0);
    vAlpha = smoothstep(0.0, 1.5, d) * (1.0 - smoothstep(uLength * 0.6, uLength, d));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float a = 1.0 - smoothstep(0.2, 0.5, length(gl_PointCoord - 0.5));
    if (a <= 0.0) discard;
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

export default function ParticleField({ count = 1200, color = "#b9c3d6" }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, sizes } = useMemo(() => {
    const random = seededRandom(1102);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Uniform over an annulus, stretched to the wide screen.
      const r = Math.sqrt(R_MIN * R_MIN + random() * (R_MAX * R_MAX - R_MIN * R_MIN));
      const a = random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r * 1.3;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = random() * LENGTH;
      // Depth layers: mostly fine dust, a few larger soft motes.
      sizes[i] = random() < 0.85 ? 0.018 + random() * 0.012 : 0.045 + random() * 0.04;
    }
    return { positions, sizes };
  }, [count]);

  // Created once; updated through the material ref, so render stays pure.
  const [uniforms] = useState(() => ({
    uCamZ: { value: 0 },
    uLength: { value: LENGTH },
    uScale: { value: 1 },
    uColor: { value: new THREE.Color() },
    uOpacity: { value: 0.5 },
  }));

  useFrame((state, delta) => {
    const p = pointsRef.current;
    const m = materialRef.current;
    if (!p || !m) return;
    const dt = Math.min(delta, 1 / 20);
    const { damp } = THREE.MathUtils;
    m.uniforms.uCamZ.value = state.camera.position.z;
    m.uniforms.uColor.value.set(color);
    // Matches three's size attenuation: world size → px at depth 1.
    m.uniforms.uScale.value = state.size.height * state.viewport.dpr * 0.5;
    // A slow roll around the flight axis, leaning with the pointer.
    p.rotation.z = motionStore.sceneTime * 0.01;
    p.position.x = damp(p.position.x, motionStore.pointerX * 0.2, 2, dt);
    p.position.y = damp(p.position.y, motionStore.pointerY * 0.15, 2, dt);
  });

  return (
    // Positions are moved on the GPU, so the CPU-side bounds are meaningless.
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
