"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FallbackBackground from "./FallbackBackground";
import { canShowScene } from "@/lib/sceneSupport";

// WebGL must stay client-only; this wrapper lets the page itself remain a Server Component.
const CanvasContainer = dynamic(() => import("./CanvasContainer"), { ssr: false });

export default function Background() {
  const [load3d, setLoad3d] = useState(false);

  useEffect(() => {
    if (!canShowScene()) return;
    // Load three.js only once the browser is idle, so it never competes with the first render.
    const start = () => setLoad3d(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

  if (load3d) return <CanvasContainer />;

  // Same gradient the canvas fades in over, so the switch is seamless.
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 select-none" aria-hidden>
      <FallbackBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}
