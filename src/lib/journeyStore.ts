/**
 * The station journey's timeline: which stations exist (in DOM order), and where on the scroll
 * axis each one arrives, holds and leaves. Shared by the DOM driver (JourneyProvider), the
 * navigation and the 3D scene, so panels, camera and navbar always agree.
 * Mutable and render-free, like motionStore; `subscribe` notifies on rebuilds and section changes.
 */

import { galaxySide } from "./stationGalaxies";

/** Phase lengths in viewport heights. The next station arrives while the previous one leaves.
 * Holds are short, so every scroll step changes something. */
const ARRIVE = 0.55;
const HOLD = 0.35;
const LEAVE = ARRIVE;
/** Route distance (in stations) the camera still covers during a hold: it slows but never stops. */
const HOLD_U = 0.2;

export type Station = {
  el: HTMLElement;
  /** Station name (data-station), e.g. "about" or "projects-2". */
  name: string;
  body: HTMLElement;
  /** Nav section id this station belongs to (e.g. "projects"), or null for the hero. */
  section: string | null;
  /** Scroll offset (px) where the station starts arriving. */
  start: number;
  arrive: number;
  hold: number;
  leave: number;
  /** Content height beyond the viewport, scrolled through during the hold. */
  overflow: number;
  height: number;
  /** Content layers (elements with data-depth) that arrive and leave at their own depth. */
  layers: { el: HTMLElement; depth: number }[];
};

export type Phase = "before" | "arrive" | "hold" | "leave" | "after";

type Listener = () => void;

export const journeyStore = {
  enabled: false,
  stations: [] as Station[],
  /** Total scroll length of the journey in px. */
  total: 0,
  vh: 0,
  /** Bumped on every rebuild, for useSyncExternalStore consumers (the 3D route). */
  version: 0,
  /** Section of the station being held, for the navbar. */
  activeSection: null as string | null,
  /** Piecewise-linear map from scroll offset to route position (see routeU). */
  knots: [] as { px: number; u: number }[],
  listeners: new Set<Listener>(),

  subscribe(fn: Listener) {
    journeyStore.listeners.add(fn);
    return () => {
      journeyStore.listeners.delete(fn);
    };
  },

  emit() {
    for (const fn of journeyStore.listeners) fn();
  },

  /** Measures the stations in DOM order and lays out the timeline. */
  build() {
    const vh = window.innerHeight;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    let start = 0;
    const stations: Station[] = els.map((el, i) => {
      const body = el.firstElementChild as HTMLElement;
      const name = el.dataset.station ?? "";
      // Which side its galaxy is on; the content takes the other side (see globals.css).
      const side = galaxySide(i, name);
      if (side) el.dataset.galaxy = side;
      else delete el.dataset.galaxy;
      const height = body.offsetHeight;
      const overflow = Math.max(0, height - vh);
      const station: Station = {
        el,
        name,
        body,
        section: el.dataset.section || null,
        start,
        arrive: i === 0 ? 0 : ARRIVE * vh,
        hold: HOLD * vh + overflow,
        leave: i === els.length - 1 ? 0 : LEAVE * vh,
        overflow,
        height,
        layers: Array.from(body.querySelectorAll<HTMLElement>("[data-depth]"), (layer) => ({
          el: layer,
          depth: Number(layer.dataset.depth) || 1,
        })),
      };
      start += station.arrive + station.hold;
      return station;
    });
    journeyStore.stations = stations;
    journeyStore.vh = vh;
    const last = stations[stations.length - 1];
    journeyStore.total = last ? last.start + last.arrive + last.hold : 0;
    // Station i is centred on u = i: its hold covers i ± HOLD_U/2 (the first and last only half),
    // and the flight in between covers the rest, faster.
    journeyStore.knots = stations.flatMap((st, i) => {
      const holdStart = st.start + st.arrive;
      return [
        { px: holdStart, u: i === 0 ? 0 : i - HOLD_U / 2 },
        { px: holdStart + st.hold, u: i === stations.length - 1 ? i : i + HOLD_U / 2 },
      ];
    });
    journeyStore.version++;
    journeyStore.emit();
  },

  /** Phase and progress (0..1) of station i at scroll offset px. */
  phaseAt(px: number, i: number): { phase: Phase; p: number } {
    const s = journeyStore.stations[i];
    const t = px - s.start;
    if (t < 0) return { phase: "before", p: 0 };
    if (t < s.arrive) return { phase: "arrive", p: t / s.arrive };
    if (t <= s.arrive + s.hold || s.leave === 0) return { phase: "hold", p: Math.min((t - s.arrive) / s.hold, 1) };
    if (t < s.arrive + s.hold + s.leave) return { phase: "leave", p: (t - s.arrive - s.hold) / s.leave };
    return { phase: "after", p: 1 };
  },

  holdStart(i: number) {
    const s = journeyStore.stations[i];
    return s.start + s.arrive;
  },

  /** Scroll target for flying to station i: a few px into its hold, so smooth-scroll rounding
   * can't leave it a hair before arrival has finished. */
  holdPx(i: number) {
    return journeyStore.holdStart(i) + 4;
  },

  /**
   * Continuous route position: i in the middle of station i's hold, moving slowly through the
   * hold and faster between stations. A pure function of the scroll offset, never standing still.
   */
  routeU(px: number) {
    const k = journeyStore.knots;
    if (!k.length) return 0;
    if (px <= k[0].px) return k[0].u;
    for (let i = 1; i < k.length; i++) {
      if (px <= k[i].px) {
        const span = k[i].px - k[i - 1].px;
        return span > 0 ? k[i - 1].u + ((px - k[i - 1].px) / span) * (k[i].u - k[i - 1].u) : k[i].u;
      }
    }
    return k[k.length - 1].u;
  },

  /** Scroll offset for a route position (the inverse of routeU), used to keep the place on rebuilds. */
  pxForU(u: number) {
    const k = journeyStore.knots;
    if (!k.length) return 0;
    if (u <= k[0].u) return k[0].px;
    for (let i = 1; i < k.length; i++) {
      if (u <= k[i].u) {
        const span = k[i].u - k[i - 1].u;
        return span > 0 ? k[i - 1].px + ((u - k[i - 1].u) / span) * (k[i].px - k[i - 1].px) : k[i].px;
      }
    }
    return k[k.length - 1].px;
  },

  /** Index of the first station of a nav section, or -1. */
  firstStationOf(section: string) {
    return journeyStore.stations.findIndex((s) => s.section === section || s.el.dataset.station === section);
  },

  indexOf(el: Element) {
    return journeyStore.stations.findIndex((s) => s.el === el);
  },
};
