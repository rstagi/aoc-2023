import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  return solve(parseInput(input), 2);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  return solve(parseInput(input), 1000000);
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input.map((line) => line.split("")).filter((x) => x.length > 0);
}

function solve(grid: string[][], multiplier: number) {
  const emptyRows = [],
    emptyCols = [];
  for (let i = 0; i < grid.length; ++i) {
    if (grid[i].every((x) => x === ".")) {
      emptyRows.push(i);
    }
  }
  for (let i = 0; i < grid[0].length; ++i) {
    if (grid.every((row) => row[i] === ".")) {
      emptyCols.push(i);
    }
  }

  const galaxies: [number, number][] = [];
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
      if (grid[i][j] === "#") {
        galaxies.push([i, j]);
      }
    }
  }

  let sum = 0;
  for (let i = 0; i < galaxies.length; ++i) {
    const [x1, y1] = galaxies[i];
    for (let j = i + 1; j < galaxies.length; ++j) {
      const [x2, y2] = galaxies[j];
      const offsetX = emptyRows.filter(
        (x) => (x > x1 && x < x2) || (x > x2 && x < x1),
      ).length;
      const offsetY = emptyCols.filter(
        (x) => (x > y1 && x < y2) || (x > y2 && x < y1),
      ).length;
      sum +=
        Math.abs(x1 - x2) +
        offsetX * (multiplier - 1) +
        Math.abs(y1 - y2) +
        offsetY * (multiplier - 1);
    }
  }

  return sum;
}

export const __forceInput = {
  // force: true,
  input: `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim(),
};
