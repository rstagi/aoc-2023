import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const grids = parseInput(input);
  const verticals = grids.map(colsOnLeftOfReflection);
  const horizontals = grids
    .filter((_, i) => !verticals[i])
    .map(rowsOnTopOfReflection);

  console.log(
    grids.length,
    verticals.filter((v) => v > 0).length,
    horizontals.filter((h) => h > 0).length,
  );

  return (
    verticals.reduce(...__reducers.sum) +
    100 * horizontals.reduce(...__reducers.sum)
  );
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  // console.log(parsedInput);
  const {} = parsedInput;

  return 42;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  const grids = [];
  let nextSplit = input.findIndex((line) => line === "");
  while (nextSplit !== -1) {
    const grid = input.splice(0, nextSplit).map((line) => line.split(""));
    grids.push(grid);
    input.shift();
    nextSplit = input.findIndex((line) => line === "");
  }

  grids.push(input.map((line) => line.split("")));

  return grids.filter((grid) => grid && grid.length > 0);
}

let stopAfter = 0,
  count = 0;
function colsOnLeftOfReflection(grid: string[][]) {
  const cols = __grids.toCols(grid).map((col) => col.join(""));

  for (let i = 1; i < cols.length; i++) {
    let reflects = true,
      foundSmudge = false;
    for (let j = Math.max(0, i * 2 - cols.length); j < i; j++) {
      const eqChars = countEqualChars(cols[j], cols[i * 2 - j - 1]);
      if (eqChars < cols[j].length - 1) {
        reflects = false;
        break;
      } else if (eqChars === cols[j].length - 1) {
        if (foundSmudge) {
          reflects = false;
          break;
        }
        foundSmudge = true;
      }
    }
    if (reflects && foundSmudge) {
      return i;
    }
  }

  // count++;
  // if (count >= stopAfter) {
  //   console.log(cols);
  //   process.exit(0);
  // }

  return 0;
}

function rowsOnTopOfReflection(grid: string[][]) {
  const rows = grid.map((row) => row.join(""));
  for (let i = 1; i < rows.length; i++) {
    let reflects = true,
      foundSmudge = false;
    for (let j = Math.max(0, i * 2 - rows.length); j < i; j++) {
      const eqChars = countEqualChars(rows[j], rows[i * 2 - j - 1]);
      if (eqChars < rows[j].length - 1) {
        reflects = false;
        break;
      } else if (eqChars === rows[j].length - 1) {
        if (foundSmudge) {
          reflects = false;
          break;
        }
        foundSmudge = true;
      }
    }
    if (reflects && foundSmudge) {
      return i;
    }
  }

  return 0;
}

function countEqualChars(a: string, b: string) {
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) count++;
  }
  return count;
}

export const __forceInput = {
  // force: true,
  input: `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim(),
};
