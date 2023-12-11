import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

const CONNECTING_TO_UP = ["|", "L", "J", "S"];
const CONNECTING_TO_DOWN = ["|", "F", "7", "S"];
const CONNECTING_TO_LEFT = ["-", "J", "7", "S"];
const CONNECTING_TO_RIGHT = ["-", "L", "F", "S"];

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const { loops } = getGridAndLoopInfo(input);
  return loops
    .flatMap((r) => r)
    .filter((r) => r !== Infinity)
    .reduce(...__reducers.max);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const { grid } = getGridAndLoopInfo(input);
  let countInside = 0,
    isInsideLR = false,
    isInsideUD = grid[0].map(() => false),
    lastSymbolLR = "|",
    lastSymbolUD = "-".repeat(grid[0].length).split("");
  for (let i = 0; i < grid.length; ++i) {
    lastSymbolLR = "|";
    isInsideLR = false;
    for (let j = 0; j < grid[i].length; ++j) {
      if (grid[i][j] !== ".") {
        if (grid[i][j] === "|") {
          isInsideLR = !isInsideLR;
          lastSymbolLR = "|";
        } else if (grid[i][j] === "-") {
          isInsideUD[j] = !isInsideUD[j];
          lastSymbolUD[j] = "-";
        } else {
          if (
            lastSymbolLR === "|" ||
            lastSymbolLR === grid[i][j] ||
            (lastSymbolLR === "F" && grid[i][j] === "7") ||
            (lastSymbolLR === "7" && grid[i][j] === "F") ||
            (lastSymbolLR === "J" && grid[i][j] === "L") ||
            (lastSymbolLR === "L" && grid[i][j] === "J")
          ) {
            isInsideLR = !isInsideLR;
            lastSymbolLR = grid[i][j];
          }
          if (
            lastSymbolUD[j] === "-" ||
            lastSymbolUD[j] === grid[i][j] ||
            (lastSymbolUD[j] === "7" && grid[i][j] === "J") ||
            (lastSymbolUD[j] === "J" && grid[i][j] === "7") ||
            (lastSymbolUD[j] === "F" && grid[i][j] === "L") ||
            (lastSymbolUD[j] === "L" && grid[i][j] === "F")
          ) {
            isInsideUD[j] = !isInsideUD[j];
            lastSymbolUD[j] = grid[i][j];
          }
        }
        continue;
      }

      if (isInsideLR && isInsideUD[j]) {
        countInside += 1;
      }
    }
  }

  return countInside;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return __input.toGrid(input);
}

export function getGridAndLoopInfo(input: string[]) {
  const grid = parseInput(input);

  const loops = grid.map((r) => r.map(() => Infinity));
  const queue: __grids.Coordinate[] = [];

  const [startPos] = __grids.findAllInGrid(grid, (x) => x === "S");
  __grids.set(loops, startPos, 0);
  queue.push(...allReacheableFrom(startPos));

  while (queue.length > 0) {
    const curr = queue.shift();

    const reacheableFromCurr = allReacheableFrom(curr);
    const loopDist =
      reacheableFromCurr
        .map((c) => __grids.get(loops, c, Infinity))
        .reduce(...__reducers.min) + 1;
    __grids.set(loops, curr, loopDist);

    const toVisit = reacheableFromCurr.filter(
      (c) => __grids.get(loops, c, Infinity) > loopDist,
    );

    queue.push(...toVisit.filter((c) => !isInQueue(c)));
  }

  const loopAt = grid.map((r) => r.map(() => false));
  __grids.scanGrid(loops, (_, coord) => {
    const isInLoop =
      __grids.get(loops, coord, Infinity) !== Infinity ||
      areReachable(coord, ...allReacheableFrom(coord));
    __grids.set(loopAt, coord, isInLoop);
  });

  // mask the grid with the loopAt grid
  __grids.scanGrid(grid, (_, coord) => {
    if (!__grids.get(loopAt, coord, false)) {
      __grids.set(grid, coord, ".");
      __grids.set(loops, coord, Infinity);
    }
  });

  // replace the S with the right pipe
  const replacedStart = [
    {
      ifCanGo: ["up", "down"],
      then: "|",
    },
    {
      ifCanGo: ["left", "right"],
      then: "-",
    },
    {
      ifCanGo: ["up", "left"],
      then: "J",
    },
    {
      ifCanGo: ["up", "right"],
      then: "L",
    },
    {
      ifCanGo: ["down", "left"],
      then: "7",
    },
    {
      ifCanGo: ["down", "right"],
      then: "F",
    },
  ].find(({ ifCanGo }) =>
    ifCanGo.every((dir) => canGo(startPos, dir as keyof typeof __grids.move)),
  )!.then;

  __grids.set(grid, startPos, replacedStart);

  return { grid, loops };

  function isInQueue(c: __grids.Coordinate) {
    return queue.some((_c) => `${c.x}-${c.y}` === `${_c.x}-${_c.y}`);
  }

  function areReachable(...coords: __grids.Coordinate[]) {
    return coords.every(
      ({ y, x }) => __grids.get(loops, { y, x }, Infinity) !== Infinity,
    );
  }

  function canGo(
    currCoord: __grids.Coordinate,
    dir: keyof typeof __grids.move,
  ) {
    const curr = __grids.get(grid, currCoord);
    switch (dir) {
      case "up":
        const up = __grids.get(grid, __grids.move.up(currCoord));
        return (
          CONNECTING_TO_UP.includes(curr) && CONNECTING_TO_DOWN.includes(up)
        );
      case "down":
        const down = __grids.get(grid, __grids.move.down(currCoord));
        return (
          CONNECTING_TO_DOWN.includes(curr) && CONNECTING_TO_UP.includes(down)
        );
      case "left":
        const left = __grids.get(grid, __grids.move.left(currCoord));
        return (
          CONNECTING_TO_LEFT.includes(curr) &&
          CONNECTING_TO_RIGHT.includes(left)
        );
      case "right":
        const right = __grids.get(grid, __grids.move.right(currCoord));
        return (
          CONNECTING_TO_RIGHT.includes(curr) &&
          CONNECTING_TO_LEFT.includes(right)
        );
    }
  }

  function allReacheableFrom(pos: __grids.Coordinate) {
    const reacheable: __grids.Coordinate[] = [];
    if (canGo(pos, "up")) {
      reacheable.push(__grids.move.up(pos));
    }
    if (canGo(pos, "down")) {
      reacheable.push(__grids.move.down(pos));
    }
    if (canGo(pos, "left")) {
      reacheable.push(__grids.move.left(pos));
    }
    if (canGo(pos, "right")) {
      reacheable.push(__grids.move.right(pos));
    }
    return reacheable;
  }
}

export const __forceInput = {
  // force: true,
  //   input: `
  // ...........
  // .S-------7.
  // .|F-----7|.
  // .||.....||.
  // .||.....||.
  // .|L-7.F-J|.
  // .|..|.|..|.
  // .L--J.L--J.
  // ...........
  // `.trim(),
  //   input: `
  // .F----7F7F7F7F-7....
  // .|F--7||||||||FJ....
  // .||.FJ||||||||L7....
  // FJL7L7LJLJ||LJ.L-7..
  // L--J.L7...LJS7F-7L7.
  // ....F-J..F7FJ|L7L7L7
  // ....L7.F7||L7|.L7L7|
  // .....|FJLJ|FJ|F7|.LJ
  // ....FJL-7.||.||||...
  // ....L---J.LJ.LJLJ...
  // `.trim(),
  //   input: `
  // .....
  // .S-7.
  // .|.|.
  // .L-J.
  // .....
  // `.trim(),
  input: `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim(),
};
