export type Coordinate = {
  x: number;
  y: number;
};

export function get<T>(
  grid: T[][],
  coord: Coordinate,
  defaultValue: T | undefined = undefined,
) {
  if (
    coord.x < 0 ||
    coord.y < 0 ||
    coord.y >= grid.length ||
    coord.x >= grid[coord.y].length
  ) {
    return defaultValue;
  }

  return grid[coord.y][coord.x];
}

export function set<T>(grid: T[][], coord: Coordinate, value: T) {
  if (
    coord.x < 0 ||
    coord.y < 0 ||
    coord.y >= grid.length ||
    coord.x >= grid[coord.y].length
  ) {
    return false;
  }

  grid[coord.y][coord.x] = value;
  return true;
}

export function scanGrid<T>(
  grid: T[][],
  fn: (x: T, coord: Coordinate) => void,
) {
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      fn(grid[y][x], { x, y });
    }
  }
}

export function findAllInGrid<T>(
  grid: T[][],
  fn: (x: T, coord: Coordinate) => boolean,
) {
  const found: Coordinate[] = [];
  scanGrid(grid, (x, coord) => {
    if (fn(x, coord)) {
      found.push(coord);
    }
  });
  return found;
}

export function toCols<T>(grid: T[][]) {
  return grid[0].map((_, x) => grid.map((row) => row[x]));
}

export function forEachRow<T>(
  grid: T[][],
  fn: (row: T[], index: number) => void,
) {
  return grid.forEach(fn);
}

export function forEachCol<T>(
  grid: T[][],
  fn: (col: T[], index: number) => void,
) {
  return toCols(grid).forEach(fn);
}

export function manhattanDistance(c1: Coordinate, c2: Coordinate) {
  return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
}

export function pairToCoord([x, y]: [number, number]): Coordinate {
  return { x, y };
}

export function surroundingCoords(
  c: Coordinate,
  {
    maxLen = Infinity,
    includeCorners = false,
  }: { maxLen?: number; includeCorners?: boolean } = {},
) {
  return [
    move.up(c),
    move.down(c),
    move.left(c),
    move.right(c),
    ...(includeCorners
      ? [move.upLeft(c), move.upRight(c), move.downLeft(c), move.downRight(c)]
      : []),
  ].filter((c) => c.x >= 0 && c.y >= 0 && c.x < maxLen && c.y < maxLen);
}

export function createGrid(
  rows: number,
  cols: number,
  defaultValue: () => any,
) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, defaultValue),
  );
}

export function print(grid: any[][], delim: string = " ") {
  console.log(grid.map((r) => r.join(delim)).join("\n"));
}

export const move = {
  up: (c: Coordinate, d: number = 1) => ({ x: c.x, y: c.y - d }),
  down: (c: Coordinate, d: number = 1) => ({ x: c.x, y: c.y + d }),
  left: (c: Coordinate, d: number = 1) => ({ x: c.x - d, y: c.y }),
  right: (c: Coordinate, d: number = 1) => ({ x: c.x + d, y: c.y }),
  upLeft: (c: Coordinate, d: number = 1) => ({ x: c.x - d, y: c.y - d }),
  upRight: (c: Coordinate, d: number = 1) => ({ x: c.x + d, y: c.y - d }),
  downLeft: (c: Coordinate, d: number = 1) => ({ x: c.x - d, y: c.y + d }),
  downRight: (c: Coordinate, d: number = 1) => ({ x: c.x + d, y: c.y + d }),
};
