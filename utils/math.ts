import { Coordinate } from "./grids";

export function lcm(x: number, y: number) {
  return (x * y) / gcd(x, y);
}

export function gcd(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function isBetween(a: number, b: number) {
  return (x: number) => x >= Math.min(a, b) && x <= Math.max(a, b);
}

export function shoelaceFormula(vertexes: Coordinate[]) {
  const x = vertexes.map((r) => r.x);
  const y = vertexes.map((r) => r.y);
  const n = vertexes.length;

  let area = 0;

  for (let i = 0; i < n - 1; i++) {
    area += x[i] * y[i + 1] - x[i + 1] * y[i];
  }

  // Add the last term
  area += x[n - 1] * y[0] - x[0] * y[n - 1];

  // Take the absolute value and divide by 2
  area = Math.abs(area) / 2;

  return area;
}
