export function insertAt<T>(src: T[], index: number, element: T) {
  return src.splice(index, 0, element);
}

export function pairs<T>(src: T[]) {
  const pairs = [];
  for (let i = 0; i < src.length; i++) {
    for (let j = i + 1; j < src.length; j++) {
      pairs.push([src[i], src[j]]);
    }
  }
  return pairs;
}

export function scanGrid<T>(
  grid: T[][],
  fn: (x: T, i: number, j: number) => void,
) {
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      fn(grid[i][j], i, j);
    }
  }
}

export function findAllInGrid<T>(
  grid: T[][],
  fn: (x: T, i: number, j: number) => boolean,
) {
  const found = [];
  scanGrid(grid, (x, i, j) => {
    if (fn(x, i, j)) {
      found.push([i, j]);
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
