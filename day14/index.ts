import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const grid = parseInput(input);
  const afterNorth = __grids.toCols(__grids.toCols(grid).map(rollRocks));
  return totalLoadOnNorth(afterNorth);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const grid = parseInput(input);

  let current = grid;
  const cache = {
      [current.map((r) => r.join("")).join("")]: 0,
    },
    seq = [grid];
  for (let i = 0; i < 1000000000; i++) {
    const afterNorth = __grids.toCols(current).map(rollRocks);
    const afterWest = __grids.toCols(afterNorth).map(rollRocks);
    const afterSouth = __grids.toCols(afterWest.reverse()).map(rollRocks);
    const afterEast = __grids
      .toCols(afterSouth)
      .map((l) => rollRocks(l.reverse()).reverse())
      .reverse();

    current = afterEast;

    const cyclePos = cache[afterEast.map((r) => r.join("")).join("")];
    if (cyclePos !== undefined) {
      const finalPos = cyclePos - 1 + ((1000000000 - i) % (i - cyclePos + 1));
      current = seq[finalPos];
      break;
    }

    cache[current.map((r) => r.join("")).join("")] = seq.length;
    current = afterEast;
    seq.push(current);
  }

  return totalLoadOnNorth(current);
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return __input.toGrid(input);
}

function rollRocks(line: string[]) {
  let currFreePos = 0;
  const newLine = line.map(() => ".");
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "#") {
      currFreePos = i + 1;
      newLine[i] = "#";
    } else if (line[i] === "O") {
      newLine[currFreePos] = "O";
      currFreePos++;
    }
  }
  return newLine;
}

function totalLoadOnNorth(grid: string[][]) {
  return __grids.toCols(grid).reduce((totalLoad, col) => {
    let colLoad = 0;
    for (let i = 0; i < col.length; i++) {
      if (col[i] === "O") {
        colLoad += grid.length - i;
      }
    }
    return totalLoad + colLoad;
  }, 0);
}

export const __forceInput = {
  // force: true,
  input: `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim(),
};
