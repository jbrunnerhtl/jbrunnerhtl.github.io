## Context

`buildRoute` places one waypoint per station with a sine plus random offset sideways (about ±8.5) and vertically (about ±3.75), joined by a centripetal Catmull-Rom curve. `FlightDriver` looks along the tangent and rolls by the heading change just ahead. `journeyStore.routeU` maps the scroll offset to the route position piecewise linearly over two knots per station hold, so the speed is constant within a hold (about 0.57 stations per viewport) and within a flight (about 1.45), and jumps between them.

## Goals / Non-Goals

**Goals:** a straight flight with no heading changes or roll, and continuous speed, while keeping every station at the same scroll position and route position as before.

**Non-Goals:** no change to phase timing, galaxy/nebula design, station content or the fallback.

## Decisions

- **Collinear, evenly spaced waypoints on the same Catmull-Rom curve.** For evenly spaced points on a line, the curve is the line and `getPoint(i / (count - 1))` is still waypoint i, so `waypointFrame`, galaxies and nebulae need no change. Every waypoint frame is now identical (forward −z, right +x, up +y), so galaxies sit exactly beside the path on their side.
- **Cubic Hermite between knots, with each knot carrying its hold's speed.** A hold segment has the same speed at both ends and so stays linear. A flight segment starts at the previous hold's speed and ends at the next one's, easing up to about 2× in the middle. End slopes are capped at 3× the segment's average (Fritsch–Carlson), which keeps u monotone, so the camera never flies backwards while scrolling forward. Knot positions and u values are unchanged, so the held station, navbar targets and hash links stay the same.
- **`pxForU` by bisection.** The Hermite has no convenient closed-form inverse. It only runs on rebuilds (resize/breakpoint), and 32 steps to 0.01 px are negligible.

## Risks / Trade-offs

- [A straight line can feel less like a journey] → Galaxies still alternate sides and nebulae pass beside the route, so there is still parallax and variety. The owner asked for straight explicitly.
- [Peak speed between stations is a little higher (about 2 vs 1.45 stations per viewport)] → It is the same distance over the same scroll length. The ease-in and ease-out make it feel calmer than the old constant speed with jumps.
