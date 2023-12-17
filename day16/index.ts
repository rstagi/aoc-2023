import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";
import { Coordinate } from "../utils/grids";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const grid = parseInput(input);

  let max = 0;
  // @ts-ignore
  const startingPositions: [Coordinate, "right" | "up" | "down" | "left"][] = [
    ...grid.map((_, x) => [{ x, y: 0 }, "down"]),
    ...grid.map((_, x) => [{ x, y: grid.length - 1 }, "up"]),
    ...grid[0].map((_, y) => [{ x: 0, y }, "right"]),
    ...grid[0].map((_, y) => [{ x: grid[0].length - 1, y }, "left"]),
  ];
  for (const startingPosition of startingPositions) {
    const visitedCache = new Set<string>();
    const visited = grid.map((row) => row.map(() => false));
    const queue: [Coordinate, "right" | "up" | "down" | "left"][] = [];
    queue.push(startingPosition);
    while (queue.length > 0) {
      const [current, direction] = queue.shift()!;
      const currVal = __grids.get(grid, current);
      if (
        !currVal ||
        visitedCache.has(`${current.x},${current.y},${direction}`)
      ) {
        continue;
      }

      __grids.set(visited, current, true);
      visitedCache.add(`${current.x},${current.y},${direction}`);

      if (
        currVal === "." ||
        (["right", "left"].includes(direction) && currVal === "-") ||
        (["up", "down"].includes(direction) && currVal === "|")
      ) {
        const next = __grids.move[direction](current);
        if (__grids.get(grid, next) !== undefined) {
          queue.push([__grids.move[direction](current), direction]);
        }
        continue;
      }

      if (direction === "right" && currVal === "\\") {
        queue.push([__grids.move.down(current), "down"]);
      } else if (direction === "right" && currVal === "/") {
        queue.push([__grids.move.up(current), "up"]);
      } else if (direction === "left" && currVal === "\\") {
        queue.push([__grids.move.up(current), "up"]);
      } else if (direction === "left" && currVal === "/") {
        queue.push([__grids.move.down(current), "down"]);
      } else if (direction === "up" && currVal === "\\") {
        queue.push([__grids.move.left(current), "left"]);
      } else if (direction === "up" && currVal === "/") {
        queue.push([__grids.move.right(current), "right"]);
      } else if (direction === "down" && currVal === "\\") {
        queue.push([__grids.move.right(current), "right"]);
      } else if (direction === "down" && currVal === "/") {
        queue.push([__grids.move.left(current), "left"]);
      } else if (["right", "left"].includes(direction) && currVal === "|") {
        queue.push([__grids.move.down(current), "down"]);
        queue.push([__grids.move.up(current), "up"]);
      } else if (["up", "down"].includes(direction) && currVal === "-") {
        queue.push([__grids.move.left(current), "left"]);
        queue.push([__grids.move.right(current), "right"]);
      }
    }

    let countVisited = 0;
    __grids.scanGrid(visited, (x) => {
      if (x) {
        countVisited++;
      }
    });
    max = Math.max(max, countVisited);
  }
  return max;
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
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trim(),
};
