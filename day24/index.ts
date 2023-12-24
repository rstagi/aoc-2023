/// <reference path="../types/globals.d.ts" />

import { makePairs } from "../utils/arrays";

// Note: gets trimmed
export const inputs = [
  `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`,
];

export function main() {
  const input = getInput(0).split("\n");
  const hailstones = input
    .map((l) => l.split(" @ "))
    .map(([positions, velocities]) => [
      positions.split(", ").map((n) => parseInt(n)),
      velocities.split(", ").map((n) => parseInt(n)),
    ])
    .map(([[x, y, z], [vx, vy, vz]]) => ({
      pos: { x, y, z },
      velocity: { vx, vy, vz },
    }));

  const paths = hailstones.map(({ pos, velocity }, id) => ({
    id,
    m: velocity.vy / velocity.vx,
    a: pos.y - (velocity.vy * pos.x) / velocity.vx,
    velocity,
    startPos: pos,
  }));

  const delta = 0.01;
  const MIN_INTERSECT_XY = (isCustomMode() ? 7 : 200000000000000) - delta,
    MAX_INTERSECT_XY = (isCustomMode() ? 27 : 400000000000000) + delta;

  const inRange = ({ x, y }: { x: number; y: number }) =>
    MIN_INTERSECT_XY <= x &&
    x <= MAX_INTERSECT_XY &&
    MIN_INTERSECT_XY <= y &&
    y <= MAX_INTERSECT_XY;

  const isInFuture = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    velocity: { vx: number; vy: number },
  ) => {
    // movement and velocity should be of the same sign
    return (
      !isEqual(end.x, start.x) &&
      !isEqual(end.y, start.y) &&
      (end.x - start.x) * velocity.vx > 0 &&
      (end.y - start.y) * velocity.vy > 0
    );
  };

  const isEqual = (a: number, b: number) => a - delta <= b && b <= a + delta;

  const intersectionPoints = makePairs(paths)
    .map(([p1, p2]) => {
      if (isEqual(p1.m, p2.m)) {
        return { doIntersect: false };
      }

      const ix = (p2.a - p1.a) / (p1.m - p2.m);
      const iy = p1.m * ix + p1.a;
      const point = { x: ix, y: iy };

      return {
        doIntersect: true,
        isInFuture:
          isInFuture(p1.startPos, point, p1.velocity) &&
          isInFuture(p2.startPos, point, p2.velocity),
        point,
        paths: [p1.id, p2.id],
      };
    })
    .filter((i) => i.doIntersect && inRange(i.point) && i.isInFuture);

  sol1(intersectionPoints.length);
}
