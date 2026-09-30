"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneLayout } from "./sceneLayout";
import { buildRoute, type Route } from "./route";
import Starfield from "./Starfield";
import SkyBackground from "./SkyBackground";
import Nebulae from "./Nebulae";
import Galaxies from "./Galaxies";
import { SPACE } from "./spaceTheme";
import FallbackBackground from "./FallbackBackground";
import { journeyStore } from "@/lib/journeyStore";
import { isWebGLAvailable } from "@/lib/webgl";
import { motionStore } from "@/lib/motionStore";

const flight = { pos: new THREE.Vector3(), tangent: new THREE.Vector3(), look: new THREE.Vector3() };

/**
 * Flies the camera straight along the route with the scroll position (slowly through each held
 * station, faster in between), looking ahead. Also advances the pausable scene clock.
 * Mounted before the scene objects, so they read this frame's camera and time.
 */
function FlightDriver({ route }: { route: Route }) {
  useFrame((state, delta) => {
    motionStore.sceneTime += Math.min(delta, 1 / 20);
    const u = journeyStore.stations.length ? journeyStore.routeU(motionStore.scrollPx) : 0;

    const t = Math.min(u / (route.count - 1), 1);
    route.curve.getPoint(t, flight.pos);
    route.curve.getTangent(t, flight.tangent);
    const cam = state.camera;
    cam.position.copy(flight.pos);
    cam.lookAt(flight.look.copy(flight.pos).add(flight.tangent));
  });
  return null;
}

/** How long to keep rendering after the last scroll/pointer input, so the damped motion can settle. */
const SETTLE_MS = 1600;

/**
 * Drives the render loop (the Canvas uses frameloop="demand"):
 * always while the hero is on screen (with a mouse or trackpad; touch devices save their battery);
 * otherwise only while the user scrolls, moves the pointer or touches the screen (plus SETTLE_MS,
 * so damped motion can settle). Idle, the scene costs no GPU time at all.
 */
function FrameDriver({ wakeKey }: { wakeKey: string }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let activeUntil = performance.now() + SETTLE_MS; // also covers the first frames after the stations change
    let last = { px: -1, x: 0, y: 0 };
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onTouch = () => {
      activeUntil = performance.now() + SETTLE_MS;
    };
    window.addEventListener("touchstart", onTouch, { passive: true });

    const tick = (now: number) => {
      const { scrollPx, pointerX, pointerY } = motionStore;
      if (scrollPx !== last.px || pointerX !== last.x || pointerY !== last.y) {
        activeUntil = now + SETTLE_MS;
        last = { px: scrollPx, x: pointerX, y: pointerY };
      }
      const inHero = finePointer && scrollPx < window.innerHeight * 0.9;
      // Full rate everywhere while active: the flight visibly stutters at half rate.
      if (inHero || now < activeUntil) invalidate();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", onTouch);
    };
  }, [invalidate, wakeKey]);

  return null;
}

const subscribeJourney = (fn: () => void) => journeyStore.subscribe(fn);
const journeyVersion = () => journeyStore.version;

export default function CanvasContainer() {
  // Loaded with ssr: false, so window is always available here.
  const [hasWebGL] = useState(isWebGLAvailable);
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [layout] = useState(() => sceneLayout(window.innerWidth, window.innerHeight));
  const [ready, setReady] = useState(false);
  const space = SPACE;

  // One waypoint per station: rebuilt when the journey's stations change (e.g. across the breakpoint).
  const version = useSyncExternalStore(subscribeJourney, journeyVersion, journeyVersion);
  const namesKey = useMemo(() => {
    void version;
    return journeyStore.stations.map((s) => s.name).join(",");
  }, [version]);
  const names = useMemo(() => (namesKey ? namesKey.split(",") : ["hero"]), [namesKey]);
  const route = useMemo(() => buildRoute(names.length), [names]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none" aria-hidden>
      <FallbackBackground />

      {hasWebGL && (
        <Canvas
          camera={{ position: [0, 0, 0], fov: 42, far: 1200 }}
          frameloop="demand"
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={() => requestAnimationFrame(() => setReady(true))}
          className="transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <Suspense fallback={null}>
            <SkyBackground
              sky={space.sky}
              nebulaA={space.nebulaA}
              nebulaB={space.nebulaB}
              stars={space.skyStars}
              size={isMobile ? 512 : 1024}
            />
            <FrameDriver wakeKey={namesKey} />
            <FlightDriver route={route} />
            <Starfield count={isMobile ? 3000 : 8000} colors={space.stars} />
            <Nebulae route={route} tints={space.nebulae} />
            <Galaxies route={route} names={names} layout={layout} />
          </Suspense>
        </Canvas>
      )}

      {/* Soft vignette; the station panels bring their own surfaces, so the scene isn't dimmed. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_oklab,var(--bg)_65%,transparent)_100%)]" />
    </div>
  );
}
