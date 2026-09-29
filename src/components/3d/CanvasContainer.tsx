"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import GithubCompanion from "./GithubCompanion";
import { sceneLayout } from "./sceneLayout";
import { CAMERA_START_Z, flightCameraZ } from "./flight";
import ParticleField from "./ParticleField";
import FallbackBackground from "./FallbackBackground";
import { isWebGLAvailable } from "@/lib/webgl";
import { motionStore } from "@/lib/motionStore";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";

// Per-mode studio lighting for the chrome companion.
const SCENE: Record<ResolvedTheme, { dome: string; top: string; bottom: string; strips: string[]; particles: string }> = {
  dark: {
    dome: "#1a1d24",
    top: "#dfe7f5",
    bottom: "#4b3f72",
    strips: ["#ffffff", "#9fd8ff", "#c4b5fd", "#ffffff"],
    particles: "#b9c3d6",
  },
  light: {
    dome: "#9aa3b2",
    top: "#ffffff",
    bottom: "#5b4d9a",
    strips: ["#ffffff", "#5aa9ff", "#a78bfa", "#ffffff"],
    particles: "#4b5563",
  },
};

const STRIP_POSITIONS: [number, number][] = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return [Math.cos(a) * 6, Math.sin(a) * 6];
});

// Base / max scrim opacity per layout: stronger where the companion sits behind text,
// but light enough past the hero that the flight stays visible.
const SCRIM = { mobile: [0.4, 0.5], tablet: [0.25, 0.4], desktop: [0.12, 0.35] } as const;

/** Dims the scene over the first ~700px of scroll by writing opacity straight to the DOM (no re-renders). */
function ScrimDriver() {
  useFrame((state) => {
    const el = document.getElementById("scene-scrim");
    if (!el) return;
    const [base, max] = SCRIM[sceneLayout(state.size.width, state.size.height)];
    const dim = Math.min(motionStore.scrollPx / 700, 1);
    el.style.opacity = String(base + dim * (max - base));
  });
  return null;
}

/**
 * Flies the camera through space with the scroll position and advances the pausable scene clock.
 * Mounted before the scene objects, so they read this frame's camera and time.
 */
function FlightDriver() {
  useFrame((state, delta) => {
    motionStore.sceneTime += Math.min(delta, 1 / 20);
    state.camera.position.z = flightCameraZ(motionStore.scrollPx);
  });
  return null;
}

/** How long to keep rendering after the last scroll/pointer input, so the damped motion can settle. */
const SETTLE_MS = 1600;

/**
 * Drives the render loop (the Canvas uses frameloop="demand"):
 * always while the hero is on screen; elsewhere only while the user scrolls or moves the pointer
 * (plus SETTLE_MS, which also lets the companion catch up). Idle, the scene costs no GPU time at all.
 */
function FrameDriver({ wakeKey }: { wakeKey: string }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let activeUntil = performance.now() + SETTLE_MS; // also re-bakes the env map after a theme change
    let last = { px: -1, x: 0, y: 0 };

    const tick = (now: number) => {
      const { scrollPx, pointerX, pointerY } = motionStore;
      if (scrollPx !== last.px || pointerX !== last.x || pointerY !== last.y) {
        activeUntil = now + SETTLE_MS;
        last = { px: scrollPx, x: pointerX, y: pointerY };
      }
      const inHero = scrollPx < window.innerHeight * 0.9;
      // Full rate everywhere while active: the flight visibly stutters at half rate.
      if (inHero || now < activeUntil) invalidate();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, wakeKey]);

  return null;
}

export default function CanvasContainer() {
  // Loaded with ssr: false, so window is always available here.
  const [hasWebGL] = useState(isWebGLAvailable);
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [ready, setReady] = useState(false);
  const theme = useResolvedTheme();
  const scene = SCENE[theme];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" aria-hidden>
      <FallbackBackground />

      {hasWebGL && (
        <Canvas
          camera={{ position: [0, 0, CAMERA_START_Z], fov: 42 }}
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={() => requestAnimationFrame(() => setReady(true))}
          className="transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <Suspense fallback={null}>
            {/* Procedural studio environment: no HDR download. A soft gradient dome plus a ring of
                light strips gives smooth, liquid reflections instead of hard shapes. */}
            {/* Keyed by mode: the env map is rendered once (frames=1), so remount to re-bake it. */}
            <Environment key={theme} resolution={256} frames={1}>
              <color attach="background" args={[scene.dome]} />
              <Lightformer form="rect" intensity={1.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color={scene.top} />
              {STRIP_POSITIONS.map(([x, z], i) => (
                <Lightformer
                  key={i}
                  form="rect"
                  intensity={2.2}
                  position={[x, 0, z]}
                  onUpdate={(self) => self.lookAt(0, 0, 0)}
                  scale={[1.2, 10, 1]}
                  color={scene.strips[i % scene.strips.length]}
                />
              ))}
              <Lightformer form="rect" intensity={0.8} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color={scene.bottom} />
            </Environment>

            <FrameDriver wakeKey={theme} />
            <ScrimDriver />
            <FlightDriver />
            <GithubCompanion />
            <ParticleField count={isMobile ? 450 : 1200} color={scene.particles} />
          </Suspense>
        </Canvas>
      )}

      {/* Vignette, plus a scrim that dims the scene once you scroll past the hero. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
      <div id="scene-scrim" className="absolute inset-0 bg-bg opacity-[0.12] max-md:opacity-40" />
    </div>
  );
}
