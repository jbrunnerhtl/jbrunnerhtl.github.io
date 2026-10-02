"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { NOISE_GLSL } from "./noise.glsl";

/** Sphere colors come from the CSS tokens of the active color mode. */
function readColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    base: css.getPropertyValue("--sphere-base").trim() || "#3f3a47",
    light: css.getPropertyValue("--sphere-light").trim() || "#e879f9",
  };
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A sphere pushed in and out along its normals by animated fBm noise. flatShading derives the
 * normals from screen-space derivatives, so the deformed surface breaks into lit facets without
 * recomputing normals on the CPU.
 */
function Sphere({ onReady }: { onReady: () => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const accent = useRef<THREE.DirectionalLight>(null);
  const { viewport, size, invalidate } = useThree();
  const narrow = size.width < 1024;
  const [still] = useState(reducedMotion);
  const motion = useRef({ t: 8, rx: 0, ry: 0, tx: 0, ty: 0 });

  const material = useMemo(() => {
    const m = new THREE.MeshPhongMaterial({ flatShading: true, shininess: 40, specular: new THREE.Color("#222") });
    // Shader uniforms live on the material, so the frame loop updates them through the mesh ref.
    const uniforms = { uTime: { value: 0 }, uAmp: { value: 0.32 } };
    m.userData.uniforms = uniforms;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uAmp = uniforms.uAmp;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\nuniform float uTime;\nuniform float uAmp;\n${NOISE_GLSL}`)
        .replace(
          "#include <begin_vertex>",
          /* glsl */ `#include <begin_vertex>
          // Large, slow swells plus a sharper layer that breaks the surface into facets.
          float swell = fbm(normal * 1.3 + vec3(uTime * 0.09, uTime * 0.06, -uTime * 0.07));
          float edge = noise3(normal * 3.2 + vec3(-uTime * 0.12, uTime * 0.1, uTime * 0.05));
          transformed += normal * ((swell - 0.5) * 2.2 + (edge - 0.5) * 0.35) * uAmp;`
        );
    };
    return m;
  }, []);

  // Colors follow the color mode, live.
  useEffect(() => {
    const apply = () => {
      const { base, light } = readColors();
      material.color.set(base);
      accent.current?.color.set(light);
      invalidate();
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [material, invalidate]);

  // The pointer (mouse) or the scroll position in the hero (touch) sets where the sphere turns to.
  useEffect(() => {
    if (still) return;
    const m = motion.current;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      m.ty = ((e.clientX / window.innerWidth) * 2 - 1) * 0.45;
      m.tx = ((e.clientY / window.innerHeight) * 2 - 1) * 0.3;
    };
    const onScroll = () => {
      m.tx = Math.min(window.scrollY / window.innerHeight, 1) * 0.6;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    if (coarse) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [still]);

  const ready = useRef(false);
  useFrame((_, delta) => {
    const m = motion.current;
    if (!still) {
      // The clock only advances on rendered frames, so a pause never causes a jump.
      m.t += Math.min(delta, 1 / 30);
      // Critically damped approach towards the target rotation.
      const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 3.5);
      m.rx += (m.tx - m.rx) * k;
      m.ry += (m.ty - m.ry) * k;
    }
    if (mesh.current) {
      (mesh.current.material as THREE.Material).userData.uniforms.uTime.value = m.t;
      mesh.current.rotation.set(m.rx + 0.3, m.ry + m.t * 0.04, 0);
    }
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  // Wide screens: large, to the right of the text. Narrow: fills the hero behind the text.
  // Fewer segments give larger facets (and cost less on phones).
  const radius = narrow ? Math.max(viewport.width * 0.8, viewport.height * 0.4) : viewport.height * 0.58;
  const x = narrow ? viewport.width * 0.22 : viewport.width * 0.26;
  const y = narrow ? viewport.height * 0.02 : 0;
  const segments = narrow ? 48 : 64;

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight ref={accent} position={[-6, 8, 6]} intensity={2.6} />
      <directionalLight position={[8, -4, 5]} intensity={0.7} color="#ffffff" />
      <mesh ref={mesh} position={[x, y, 0]} scale={radius} material={material}>
        <sphereGeometry args={[1, segments, segments]} />
      </mesh>
    </>
  );
}

/**
 * Renders on demand: every frame while the hero is on screen and the tab visible, never otherwise;
 * a single frame with reduced motion.
 */
function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (reducedMotion()) {
      invalidate();
      return;
    }
    const hero = document.getElementById("hero");
    let inView = true;
    let raf = 0;
    const tick = () => {
      if (inView && document.visibilityState === "visible") {
        invalidate();
        raf = requestAnimationFrame(tick);
      } else raf = 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start();
    });
    if (hero) io.observe(hero);
    const onVisibility = () => document.visibilityState === "visible" && start();
    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [invalidate]);
  return null;
}

/** The hero's 3D shape. Loaded lazily (three.js stays out of the initial JS). */
export default function DisplacementSphere({ onReady }: { onReady: () => void }) {
  const [phone] = React.useState(() => window.innerWidth < 768);
  return (
    <Canvas
      frameloop="demand"
      dpr={phone ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <FrameDriver />
      <Sphere onReady={onReady} />
    </Canvas>
  );
}
