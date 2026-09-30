"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { canShowScene } from "@/lib/sceneSupport";

// WebGL is client-only and loaded after idle, so three.js never competes with the first render.
const DisplacementSphere = dynamic(() => import("./DisplacementSphere"), { ssr: false });

/**
 * The hero's backdrop: a static gradient sphere (server-rendered, and the fallback where 3D isn't
 * worth it) that the 3D sphere fades in over. Both drift up and fade as the hero scrolls away.
 */
export default function HeroBackdrop() {
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canShowScene()) return;
    const start = () => setLoad(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      el.style.opacity = String(1 - p);
      el.style.translate = `0 ${(-p * 12).toFixed(2)}vh`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapper} aria-hidden className="pointer-events-none absolute inset-0 select-none">
      <div className={`sphere-fallback transition-opacity duration-1000 ${ready ? "opacity-0" : ""}`} />
      {load && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <DisplacementSphere onReady={() => requestAnimationFrame(() => setReady(true))} />
        </div>
      )}
    </div>
  );
}
