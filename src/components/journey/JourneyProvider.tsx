"use client";

import React, { createContext, useContext, useEffect, useRef, useSyncExternalStore } from "react";
import { useLenisRef } from "@/components/providers/SmoothScrollProvider";
import { canShowScene } from "@/lib/sceneSupport";
import { journeyStore, stableViewportHeight, type Phase, type Station } from "@/lib/journeyStore";
import { motionStore } from "@/lib/motionStore";

const JourneyContext = createContext(false);

/** True once the station journey is active (never during SSR or in the stacked fallback). */
export function useJourney() {
  return useContext(JourneyContext);
}

const noSubscribe = () => () => {};

/** Invisible stations are parked far above the viewport, so IntersectionObserver-based effects
 * (reveals, count-ups, the skills marquee) only see a station once it starts arriving. */
const PARKED = "translate3d(0, -300vh, 0)";

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIn = (t: number) => t ** 3;
const smoothstep = (a: number, b: number, t: number) => {
  const k = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return k * k * (3 - 2 * k);
};

/**
 * Moves a station's content layers: deeper layers (higher data-depth) arrive later and from
 * further below, drift against each other while held, and fly off faster when leaving.
 */
function applyLayers(layers: Station["layers"], phase: Phase, p: number) {
  for (const { el, depth } of layers) {
    let y = 0;
    let opacity = 1;
    if (phase === "arrive") {
      const delay = Math.min(0.1 * depth, 0.5);
      const lp = Math.min(Math.max((p - delay) / (1 - delay), 0), 1);
      const e = easeOut(lp);
      y = (1 - e) * 70 * depth;
      opacity = e;
    } else if (phase === "hold") {
      y = -(p - 0.5) * 12 * depth;
    } else {
      y = -6 * depth - easeIn(p) * 90 * depth;
    }
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    el.style.opacity = opacity.toFixed(3);
  }
}

/** Writes each station's arrive / hold / leave state for scroll offset px. No React renders. */
function applyStations(px: number) {
  const { stations, vh } = journeyStore;
  stations.forEach((s, i) => {
    const { phase, p } = journeyStore.phaseAt(px, i);
    const style = s.body.style;
    if (phase === "before" || phase === "after") {
      if (s.body.dataset.parked !== "") {
        s.body.dataset.parked = "";
        style.transform = PARKED;
        style.opacity = "0";
        style.pointerEvents = "none";
        style.willChange = "auto";
        style.setProperty("--fill", "0");
      }
      return;
    }
    delete s.body.dataset.parked;
    // Short content is centred; tall content starts at the top and scrolls through during the hold.
    const baseY = s.overflow > 0 ? 0 : (vh - s.height) / 2;
    let y = baseY;
    let scale = 1;
    let opacity = 1;
    if (phase === "arrive") {
      // Fades in over the later part of the arrival, once the previous station has mostly faded out,
      // so two blocks of text never sit on top of each other at half opacity.
      scale = 0.55 + 0.45 * easeOut(p);
      opacity = smoothstep(0.4, 1, p);
    } else if (phase === "hold") {
      // Keep drifting gently towards the viewer while held, so the scene never stands still.
      y = baseY - s.overflow * p;
      scale = 1 + 0.025 * p;
    } else {
      y = baseY - s.overflow;
      scale = 1.025 + 0.6 * easeIn(p);
      opacity = 1 - smoothstep(0, 0.55, p);
    }
    // Scale around the viewport centre, so content comes from and flies into the vanishing point.
    style.transformOrigin = `50% ${vh / 2 - y}px`;
    style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    style.opacity = String(opacity);
    // Interactive while held, including the last moment of arrival and the first of departure.
    const interactive = phase === "hold" || (phase === "arrive" && p > 0.95) || (phase === "leave" && p < 0.05);
    style.pointerEvents = interactive ? "auto" : "none";
    style.willChange = "transform, opacity";

    // Effects inside the station read these: --sp (-1 arriving … 0 centred … 1 leaving) moves the
    // headline shimmer, --fill (0 → 1 during arrival) draws the About timeline.
    const mid = journeyStore.holdStart(i) + s.hold / 2;
    style.setProperty("--sp", Math.min(Math.max((px - mid) / vh, -1), 1).toFixed(3));
    style.setProperty("--fill", (phase === "arrive" ? easeOut(p) : 1).toFixed(3));
    applyLayers(s.layers, phase, p);
  });

  const held = stations[Math.round(journeyStore.routeU(px))];
  const section = held?.section ?? null;
  if (section !== journeyStore.activeSection) {
    journeyStore.activeSection = section;
    journeyStore.emit();
  }
}

/**
 * Turns the page into the station journey where the 3D scene is shown: sets [data-journey],
 * measures the stations, sizes the scroll spacer and drives the stations from the scroll position.
 * Everywhere else (and during SSR) the page stays the stacked layout.
 */
export default function JourneyProvider({ children }: { children: React.ReactNode }) {
  // Server snapshot false: SSR and hydration render the stacked page, then the client switches.
  const enabled = useSyncExternalStore(noSubscribe, canShowScene, () => false);
  const lenisRef = useLenisRef();
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const spacer = spacerRef.current!;
    root.setAttribute("data-journey", "");
    journeyStore.enabled = true;
    // Positions only exist once the timeline is built, so start at the hero instead of restoring.
    history.scrollRestoration = "manual";

    const scrollToPx = (px: number, duration?: number) => {
      const lenis = lenisRef?.current;
      if (lenis) lenis.scrollTo(px, duration === undefined ? { immediate: true, force: true } : { duration });
      else window.scrollTo(0, px);
    };

    let raf = 0;
    let rebuildRaf = 0;
    let lastPx = -1;
    let first = true;
    let stationEls: Element[] = [];

    const resizeObserver = new ResizeObserver(() => {
      if (journeyStore.stations.some((s) => s.body.offsetHeight !== s.height)) scheduleRebuild();
    });

    const rebuild = () => {
      rebuildRaf = 0;
      // Keep the current place in the journey across rebuilds (resize, language switch, layout change).
      const had = journeyStore.stations.length > 0;
      const px = motionStore.scrollPx;
      const u = had ? journeyStore.routeU(px) : 0;

      journeyStore.build();
      spacer.style.height = `${journeyStore.total}px`;
      // Stations fade out below the navbar bar (see globals.css). Offsets ignore its entrance slide.
      const bar = document.querySelector<HTMLElement>("[data-navbar-bar]");
      if (bar) root.style.setProperty("--nav-clear", `${bar.offsetTop + bar.offsetHeight}px`);
      lenisRef?.current?.resize();

      stationEls = journeyStore.stations.map((s) => s.el);
      resizeObserver.disconnect();
      for (const s of journeyStore.stations) resizeObserver.observe(s.body);

      if (first) {
        first = false;
        const hash = decodeURIComponent(location.hash.slice(1));
        const i = hash ? journeyStore.firstStationOf(hash) : -1;
        if (i >= 0) scrollToPx(journeyStore.holdPx(i));
      } else if (had) {
        const target = journeyStore.pxForU(u);
        if (Math.abs(target - px) > 1) scrollToPx(target);
      }
      lastPx = -1;
    };

    function scheduleRebuild() {
      if (!rebuildRaf) rebuildRaf = requestAnimationFrame(rebuild);
    }

    // Stations come and go when a section re-renders (e.g. Projects switching to station groups).
    const mutationObserver = new MutationObserver(() => {
      const now = document.querySelectorAll("[data-station]");
      if (now.length !== stationEls.length || stationEls.some((el, i) => el !== now[i])) scheduleRebuild();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Mobile browsers resize the window whenever their toolbar shows or hides during a scroll.
    // Only a new width or stable height (rotation, window resize) changes the timeline; rebuilding
    // (and re-scrolling) mid-swipe would cut off the touch momentum.
    let viewport = { w: window.innerWidth, h: stableViewportHeight() };
    const onResize = () => {
      const next = { w: window.innerWidth, h: stableViewportHeight() };
      if (next.w === viewport.w && next.h === viewport.h) return;
      viewport = next;
      scheduleRebuild();
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      const px = motionStore.scrollPx;
      if (px !== lastPx && journeyStore.stations.length) {
        lastPx = px;
        applyStations(px);
      }
      raf = requestAnimationFrame(tick);
    };

    // Keyboard focus moving into another station flies there, so the focused element is visible.
    const onFocus = (e: FocusEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-station]");
      const i = el ? journeyStore.indexOf(el) : -1;
      if (i < 0) return;
      const px = motionStore.scrollPx;
      if (journeyStore.phaseAt(px, i).phase === "hold") return;
      const distance = Math.abs(i - journeyStore.routeU(px));
      scrollToPx(journeyStore.holdPx(i), distance <= 1 ? 0.6 : 1.4);
    };
    document.addEventListener("focusin", onFocus);

    rebuild();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rebuildRaf);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("focusin", onFocus);
      root.removeAttribute("data-journey");
      root.style.removeProperty("--nav-clear");
      journeyStore.enabled = false;
      journeyStore.stations = [];
      for (const el of stationEls) {
        const body = el.firstElementChild as HTMLElement;
        body.removeAttribute("style");
        delete body.dataset.parked;
      }
      for (const layer of document.querySelectorAll<HTMLElement>("[data-depth]")) layer.removeAttribute("style");
      spacer.style.height = "";
    };
  }, [enabled, lenisRef]);

  return (
    <JourneyContext.Provider value={enabled}>
      {children}
      <div ref={spacerRef} aria-hidden className="journey-spacer" />
    </JourneyContext.Provider>
  );
}
