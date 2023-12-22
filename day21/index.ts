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
  __grids.set(grid, startPos, ".");

  const MAX_DIST = 26501365;
  const L = grid.length;
  const N = Math.floor(MAX_DIST / L) - 1;

  const oddGrids = ((N / 2) * 2 + 1) ** 2;
  const evenGrids = (((N + 1) / 2) * 2) ** 2;

  const evenCount = countReachable(startPos, L * 2, grid);
  const oddCount = countReachable(startPos, L * 2 + 1, grid);

  const cornerTop = countReachable({ x: startPos.x, y: L - 1 }, L - 1, grid);
  const cornerRight = countReachable({ x: 0, y: startPos.y }, L - 1, grid);
  const cornerBottom = countReachable({ x: startPos.x, y: 0 }, L - 1, grid);
  const cornerLeft = countReachable({ x: L - 1, y: startPos.y }, L - 1, grid);

  const smallTopRight = countReachable({ x: 0, y: L - 1 }, L / 2 - 1, grid);
  const smallBottomRight = countReachable({ x: 0, y: 0 }, L / 2 - 1, grid);
  const smallBottomLeft = countReachable({ x: L - 1, y: 0 }, L / 2 - 1, grid);
  const smallTopLeft = countReachable({ x: L - 1, y: L - 1 }, L / 2 - 1, grid);

  const largeTopRight = countReachable(
    { x: 0, y: L - 1 },
    (L * 3) / 2 - 1,
    grid,
  );
  const largeBottomRight = countReachable(
    { x: 0, y: 0 },
    (L * 3) / 2 - 1,
    grid,
  );
  const largeBottomLeft = countReachable(
    { x: L - 1, y: 0 },
    (L * 3) / 2 - 1,
    grid,
  );
  const largeTopLeft = countReachable(
    { x: L - 1, y: L - 1 },
    (L * 3) / 2 - 1,
    grid,
  );

  console.log(oddGrids, evenGrids, oddCount, evenCount, L);

  return (
    countReachable(startPos, MAX_DIST, grid) +
    evenCount * evenGrids +
    oddCount * oddGrids +
    cornerTop +
    cornerRight +
    cornerBottom +
    cornerLeft +
    (N + 1) *
      (smallTopRight + smallBottomRight + smallBottomLeft + smallTopLeft) +
    N * (largeTopRight + largeBottomRight + largeBottomLeft + largeTopLeft)
  );
}

function countReachable(
  startPos: __grids.Coordinate,
  maxDist: number,
  grid: string[][],
) {
  let count = 0;
  const queue: {
    coord: __grids.Coordinate;
    dist: number;
  }[] = [{ coord: startPos, dist: maxDist }];
  const visited = new Set<string>([`${startPos.x},${startPos.y}`]);
  while (queue.length > 0) {
    const { coord, dist } = queue.shift()!;
    if (dist % 2 === 0) {
      count++;
    }
    if (dist === 0) {
      continue;
    }

    ["up", "down", "left", "right"].forEach((dir) => {
      const newPos = __grids.move[dir](coord);
      const destCell = __grids.get(grid, newPos);
      if (
        destCell &&
        destCell !== "#" &&
        !visited.has(`${newPos.x},${newPos.y}`)
      ) {
        visited.add(`${newPos.x},${newPos.y}`);
        queue.push({ coord: newPos, dist: dist - 1 });
      }
    });
  }

  return count;
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
