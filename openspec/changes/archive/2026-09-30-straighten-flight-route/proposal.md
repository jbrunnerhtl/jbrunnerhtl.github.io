## Why

The owner finds the flight through space too angular. The route winds sideways and up and down between the stations, the camera rolls into those turns, and its speed jumps abruptly (about 2.5×) at the start and end of every station hold. The owner wants the flight to be straight and smooth.

## What Changes

- The route becomes a straight line into the depth of space. Stations stay evenly spaced, and there are no more sideways or vertical swings and no roll.
- The camera's speed changes smoothly: it still glides slowly through each held station and faster in between, but eases between the two speeds instead of jumping.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `canvas-3d-experience`: "Scroll-Driven Flight Through Space" describes a straight route with smooth speed changes instead of a curved route with turns. "Starfield All Around" is unchanged: the stars still fill every direction, and its scenario about the route curving no longer applies.

## Impact

- `src/components/3d/route.ts`: straight, evenly spaced waypoints (no random offsets).
- `src/components/3d/CanvasContainer.tsx`: `FlightDriver` drops the roll into turns.
- `src/lib/journeyStore.ts`: the scroll → route map eases between hold and flight speed (cubic Hermite, monotone), and `pxForU` inverts it by bisection.
- Galaxies and nebulae keep their placement relative to each waypoint. The DOM, content and fallback are unchanged.
