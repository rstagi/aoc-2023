import * as __math from "./math";

export const sum = [(sum: number, n: number) => sum + n, 0] as const;
export const mul = [(mul: number, n: number) => mul * n, 1] as const;
export const max = [
  (max: number, n: number) => Math.max(max, n),
  -Infinity,
] as const;
export const min = [
  (min: number, n: number) => Math.min(min, n),
  Infinity,
] as const;
export const lcm = [
  (_lcm: number, n: number) => __math.lcm(_lcm, n),
  1,
] as const;
export const gcd = [
  (_gcd: number, n: number) => __math.gcd(_gcd, n),
  0,
] as const;
