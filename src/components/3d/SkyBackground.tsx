"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noise.glsl";

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A distant sky: soft nebula glow plus faint stars, looked up by direction only.
const fragmentShader = /* glsl */ `
  uniform vec3 uSky;
  uniform vec3 uNebulaA;
  uniform vec3 uNebulaB;
  uniform vec3 uStars;
  varying vec3 vDir;
  ${NOISE_GLSL}

  float starLayer(vec3 d, float scale, float density) {
    vec3 cell = floor(d * scale);
    float h = hash3(cell);
    if (h < density) return 0.0;
    vec3 center = cell + 0.25 + 0.5 * vec3(hash3(cell + 7.1), hash3(cell + 3.7), hash3(cell + 1.3));
    float dist = length(d * scale - center);
    return (1.0 - smoothstep(0.0, 0.32, dist)) * (0.35 + 0.65 * fract(h * 91.7));
  }

  void main() {
    vec3 d = normalize(vDir);
    float band = smoothstep(0.35, 0.8, fbm(d * 1.4 + vec3(3.0)));
    vec3 col = uSky;
    col = mix(col, uNebulaA, pow(fbm(d * 2.2), 2.0) * band * 0.9);
    col = mix(col, uNebulaB, pow(fbm(d * 3.1 + vec3(8.0)), 2.2) * (1.0 - band * 0.5) * 0.7);
    float stars = starLayer(d, 180.0, 0.985) + starLayer(d, 420.0, 0.992) * 0.7;
    col = mix(col, uStars, clamp(stars, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Renders the sky once per colour mode into a cube map and uses it as the scene background:
 * it turns with the view, never comes closer, and costs nothing per frame.
 */
export default function SkyBackground({
  sky,
  nebulaA,
  nebulaB,
  stars,
  size,
}: {
  sky: string;
  nebulaA: string;
  nebulaB: string;
  stars: string;
  size: number;
}) {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const target = new THREE.WebGLCubeRenderTarget(size);
    const cubeCamera = new THREE.CubeCamera(1, 1000, target);
    const skyScene = new THREE.Scene();
    const geometry = new THREE.SphereGeometry(500, 64, 32);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uSky: { value: new THREE.Color(sky) },
        uNebulaA: { value: new THREE.Color(nebulaA) },
        uNebulaB: { value: new THREE.Color(nebulaB) },
        uStars: { value: new THREE.Color(stars) },
      },
    });
    skyScene.add(new THREE.Mesh(geometry, material));
    cubeCamera.update(gl, skyScene);
    geometry.dispose();
    material.dispose();

    const { scene } = get();
    scene.background = target.texture;
    invalidate();
    return () => {
      if (scene.background === target.texture) scene.background = null;
      target.dispose();
    };
  }, [gl, get, invalidate, sky, nebulaA, nebulaB, stars, size]);

  return null;
}
