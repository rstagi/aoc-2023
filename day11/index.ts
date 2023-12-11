import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __grids from "../utils/grids";
import * as __arrays from "../utils/arrays";

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
  return __input.toGrid(input);
}

function isEmpty(line: string[]) {
  return line.every((x) => x === ".");
}

function solve(grid: string[][], multiplier: number) {
  const emptyRows = grid
    .map((row, i) => (isEmpty(row) ? i : undefined))
    .filter((x) => x !== undefined);

  const cols = __grids.toCols(grid);
  const emptyCols = cols
    .map((col, i) => (isEmpty(col) ? i : undefined))
    .filter((x) => x !== undefined);

  const galaxies = __grids.findAllInGrid(grid, (x) => x === "#");

  const distancesBetweenGalaxies = __arrays
    .makePairs(galaxies)
    .map(([c1, c2]) => {
      const offsetX = emptyCols.filter(__math.isBetween(c1.x, c2.x)).length;
      const offsetY = emptyRows.filter(__math.isBetween(c1.y, c2.y)).length;
      return (
        __grids.manhattanDistance(c1, c2) +
        offsetX * (multiplier - 1) +
        offsetY * (multiplier - 1)
      );
    });

  return distancesBetweenGalaxies.reduce(...__reducers.sum);
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
