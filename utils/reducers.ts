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
