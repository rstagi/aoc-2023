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
