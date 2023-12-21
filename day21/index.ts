import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const grid = parseInput(input);

  let startPos: __grids.Coordinate;
  __grids.scanGrid(grid, (value, { x, y }) => {
    if (value === "S") {
      startPos = { x, y };
    }
  });
  console.log(startPos, grid.length, grid[0].length);
  __grids.set(grid, startPos, ".");

  const MAX_DIST = 64,
    gridSize = grid.length;
  let count = 0;

  const queue: { coord: __grids.Coordinate; dist: number }[] = [
    { coord: startPos, dist: 0 },
  ];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const { coord, dist } = queue.shift()!;
    if (visited.has(`${coord.x},${coord.y}`)) {
      continue;
    }

    if ((MAX_DIST - dist) % 2 === 0) {
      console.log(
        coord,
        dist,
        __grids.get(grid, recalibrateCoord(coord, gridSize)),
      );
      count++;
    }
    visited.add(`${coord.x},${coord.y}`);

    if (dist >= MAX_DIST) {
      continue;
    }

    ["up", "down", "left", "right"].forEach((dir) => {
      const newPos = __grids.move[dir](coord);
      const destCell = __grids.get(grid, recalibrateCoord(newPos, gridSize));
      if (destCell !== "#") {
        if (!visited.has(`${newPos.x},${newPos.y}`)) {
          queue.push({ coord: newPos, dist: dist + 1 });
        }
      }
    });
  }

  return count;
}

function recalibrateCoord(coord: __grids.Coordinate, gridSize: number) {
  let { x, y } = coord;
  if (x < 0) {
    x += gridSize;
  } else if (x >= gridSize) {
    x -= gridSize;
  }

  if (y < 0) {
    y += gridSize;
  } else if (y >= gridSize) {
    y -= gridSize;
  }

  return { x, y };
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
  return __input.toGrid(input);
}

export const __forceInput = {
  // force: true,
  input: `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`.trim(),
};
