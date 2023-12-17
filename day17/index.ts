import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

type Direction = "up" | "down" | "left" | "right";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  return solve(parseInput(input), 1, 3);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  return solve(parseInput(input), 4, 10);
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return __input.toGrid(input).map((r) => r.map((c) => parseInt(c)));
}

function solve(grid: number[][], minBlocks: number, maxBlocks: number) {
  let controlPath = 0,
    currDir: "right" | "down" = "right",
    dx = 0,
    dy = 0;
  while (dx < grid.length && dy < grid[0].length) {
    for (let i = 0; i < minBlocks; i++) {
      const newC =
        currDir === "down" ? { x: dx, y: dy + i } : { x: dx + i, y: dy };
      controlPath += __grids.get(grid, newC) ?? 0;
    }
    if (currDir === "right") {
      currDir = "down";
      dx += minBlocks;
    } else if (currDir === "down") {
      currDir = "right";
      dy += minBlocks;
    }
  }

  const minHeatLoss: Record<Direction, number[]>[][] = grid.map((r) =>
    r.map(() => ({
      up: Array(maxBlocks + 1).fill(controlPath),
      down: Array(maxBlocks + 1).fill(controlPath),
      left: Array(maxBlocks + 1).fill(controlPath),
      right: Array(maxBlocks + 1).fill(controlPath),
    })),
  );
  findMinHeatLoss(grid, minHeatLoss, 0, 0, 0, "right", 0, minBlocks, maxBlocks);
  findMinHeatLoss(grid, minHeatLoss, 0, 0, 0, "down", 0, minBlocks, maxBlocks);

  return (
    Math.min(
      ...Object.values(
        __grids.get(minHeatLoss, { y: grid.length - 1, x: grid[0].length - 1 }),
      ).map((c) => Math.min(...c.slice(minBlocks, maxBlocks + 1))),
    ) - __grids.get(grid, { x: 0, y: 0 })
  );
}

function findMinHeatLoss(
  grid: number[][],
  minHeatLoss: Record<Direction, number[]>[][],
  x: number,
  y: number,
  heatLoss: number,
  currDir: Direction,
  currDirLength: number,
  minBlocks: number,
  maxBlocks: number,
) {
  if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
    return;
  }

  const currMinHeatLoss = __grids.get(minHeatLoss, { x, y });
  const currHeatLoss = heatLoss + __grids.get(grid, { x, y });
  if (currHeatLoss >= currMinHeatLoss[currDir][currDirLength]) {
    return;
  }
  currMinHeatLoss[currDir][currDirLength] = currHeatLoss;

  let all_dirs: Direction[] = [];
  if (currDir === "up") {
    all_dirs = ["up", "left", "right"];
  } else if (currDir === "down") {
    all_dirs = ["down", "left", "right"];
  } else if (currDir === "left") {
    all_dirs = ["up", "down", "left"];
  } else if (currDir === "right") {
    all_dirs = ["up", "down", "right"];
  }

  const possibleDirections =
    currDirLength < minBlocks
      ? [currDir]
      : currDirLength >= maxBlocks
        ? all_dirs.filter((d) => d !== currDir)
        : all_dirs;

  for (const dir of possibleDirections) {
    const newC = __grids.move[dir]({ x, y });
    findMinHeatLoss(
      grid,
      minHeatLoss,
      newC.x,
      newC.y,
      currHeatLoss,
      dir,
      currDir === dir ? currDirLength + 1 : 1,
      minBlocks,
      maxBlocks,
    );
  }
}

export const __forceInput = {
  // force: true,
  input: `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim(),
};
