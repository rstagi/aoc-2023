export type Coordinate = {
  x: number;
  y: number;
};

export function scanGrid<T>(
  grid: T[][],
  fn: (x: T, coord: Coordinate) => void,
) {
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      fn(grid[i][j], { x: j, y: i });
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
  return grid[0].map((_, i) => grid.map((row) => row[i]));
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
