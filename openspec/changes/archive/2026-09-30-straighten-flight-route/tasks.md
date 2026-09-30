## 1. Straight route

- [x] 1.1 Make `buildRoute` place evenly spaced waypoints on a straight line (no sine or random offsets), and drop the roll into turns from `FlightDriver`. Verify in screenshots along the route that the horizon stays level and galaxies alternate sides beside the content

## 2. Smooth speed

- [x] 2.1 Give each knot its hold's speed and interpolate `routeU` with a monotone cubic Hermite. Invert it in `pxForU` by bisection. Verify numerically that u is monotone and the speed has no jumps, and that a resize across breakpoints keeps the held station

## 3. Checks

- [x] 3.1 Run `tsc --noEmit`, `npm run lint`, `npm run build`, plus the behaviour checks (navbar, Tab, hash, idle 0 draws). All pass
