import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const { loops, loopAt } = solve(input);
  let max = 0;
  for (let i = 0; i < loops.length; ++i) {
    for (let j = 0; j < loops[i].length; ++j) {
      if (loops[i][j] === Infinity || !loopAt[i][j]) {
        continue;
      }
      max = Math.max(max, loops[i][j]);
    }
  }

  return max;
}
export function solve(input: string[]) {
  const grid = parseInput(input);

  const loops = grid.map((r) => r.map(() => Infinity));
  const queue = [];

  const shouldSkip = (i: number, j: number) => {
    return (
      i < 0 ||
      j < 0 ||
      i >= grid.length ||
      j >= grid[i].length ||
      grid[i][j] === "."
    );
  };

  const isVisitable = (
    i: number,
    j: number,
    from: readonly [number, number],
  ) => {
    const [fromI, fromJ] = from;
    return (
      !shouldSkip(i, j) &&
      !queue.some(([x, y]) => `${x}-${y}` === `${i}-${j}`) &&
      loops[i][j] > loops[fromI][fromJ] + 1
    );
  };

  let startPos: [number, number];
  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[i].length; ++j) {
      if (grid[i][j] === "S") {
        startPos = [i, j];
        loops[i][j] = 0;
        queue.push(
          ...[
            !shouldSkip(i, j - 1) ? [i, j - 1] : [],
            !shouldSkip(i, j + 1) ? [i, j + 1] : [],
            !shouldSkip(i - 1, j) ? [i - 1, j] : [],
            !shouldSkip(i + 1, j) ? [i + 1, j] : [],
            !shouldSkip(i - 1, j - 1) ? [i - 1, j - 1] : [],
            !shouldSkip(i - 1, j + 1) ? [i - 1, j + 1] : [],
            !shouldSkip(i + 1, j - 1) ? [i + 1, j - 1] : [],
            !shouldSkip(i + 1, j + 1) ? [i + 1, j + 1] : [],
          ].filter((x) => x.length > 0),
        );
        break;
      }
    }
  }

  const valOrInf = (i: number, j: number) =>
    i < 0 || j < 0 || i >= loops.length || j >= loops[i].length
      ? Infinity
      : loops[i][j];

  const areReachable = (...coords: [number, number][]) => {
    return coords.every(([i, j]) => valOrInf(i, j) !== Infinity);
  };

  const coordsToVisitFrom = (
    currCoord: [number, number],
  ): [number, number][] => {
    const [i, j] = currCoord;
    if (shouldSkip(i, j)) {
      return [];
    }

    if (grid[i][j] === "-") {
      return [
        [i, j - 1],
        [i, j + 1],
      ];
    } else if (grid[i][j] === "|") {
      return [
        [i - 1, j],
        [i + 1, j],
      ];
    } else if (grid[i][j] === "L") {
      return [
        [i - 1, j],
        [i, j + 1],
      ];
    } else if (grid[i][j] === "J") {
      return [
        [i, j - 1],
        [i - 1, j],
      ];
    } else if (grid[i][j] === "7") {
      return [
        [i + 1, j],
        [i, j - 1],
      ];
    } else if (grid[i][j] === "F") {
      return [
        [i + 1, j],
        [i, j + 1],
      ];
    }

    return [];
  };

  const validSurroundingPipes = {
    "-": (i: number, j: number) => {
      return [
        ["-", "L", "F", "S"].includes(grid[i][j - 1]) ? [i, j - 1] : [],
        ["-", "J", "7", "S"].includes(grid[i][j + 1]) ? [i, j + 1] : [],
      ].filter((x) => x.length > 0);
    },
    "|": (i: number, j: number) => {
      return [
        ["|", "F", "7", "S"].includes(grid[i - 1]?.[j]) ? [i - 1, j] : [],
        ["|", "L", "J", "S"].includes(grid[i + 1]?.[j]) ? [i + 1, j] : [],
      ].filter((x) => x.length > 0);
    },
    L: (i: number, j: number) => {
      return [
        ["-", "7", "J", "S"].includes(grid[i][j + 1]) ? [i, j + 1] : [],
        ["|", "F", "7", "S"].includes(grid[i - 1]?.[j]) ? [i - 1, j] : [],
      ].filter((x) => x.length > 0);
    },
    J: (i: number, j: number) => {
      return [
        ["-", "L", "F", "S"].includes(grid[i][j - 1]) ? [i, j - 1] : [],
        ["|", "7", "F", "S"].includes(grid[i - 1]?.[j]) ? [i - 1, j] : [],
      ].filter((x) => x.length > 0);
    },
    "7": (i: number, j: number) => {
      return [
        ["-", "L", "F", "S"].includes(grid[i][j - 1]) ? [i, j - 1] : [],
        ["|", "L", "J", "S"].includes(grid[i + 1]?.[j]) ? [i + 1, j] : [],
      ].filter((x) => x.length > 0);
    },
    F: (i: number, j: number) => {
      return [
        ["-", "7", "J", "S"].includes(grid[i][j + 1]) ? [i, j + 1] : [],
        ["|", "L", "J", "S"].includes(grid[i + 1]?.[j]) ? [i + 1, j] : [],
      ].filter((x) => x.length > 0);
    },
  };
  while (queue.length > 0) {
    const curr = queue.shift();
    const [i, j] = curr!;
    if (shouldSkip(i, j)) {
      continue;
    }

    loops[i][j] =
      validSurroundingPipes[grid[i][j]](i, j)
        .map(([x, y]) => valOrInf(x, y))
        .reduce(...__reducers.min) + 1;

    queue.push(
      ...[
        isVisitable(i, j - 1, curr) ? [i, j - 1] : [],
        isVisitable(i, j + 1, curr) ? [i, j + 1] : [],
        isVisitable(i - 1, j, curr) ? [i - 1, j] : [],
        isVisitable(i + 1, j, curr) ? [i + 1, j] : [],
        isVisitable(i - 1, j - 1, curr) ? [i - 1, j - 1] : [],
        isVisitable(i - 1, j + 1, curr) ? [i - 1, j + 1] : [],
        isVisitable(i + 1, j - 1, curr) ? [i + 1, j - 1] : [],
        isVisitable(i + 1, j + 1, curr) ? [i + 1, j + 1] : [],
      ].filter((x) => x.length > 0),
    );
  }

  const loopAt = grid.map((r) => r.map(() => false));
  const isPartOfLoop = (i: number, j: number) => {
    return (
      !shouldSkip(i, j) && areReachable([i, j], ...coordsToVisitFrom([i, j]))
    );
  };
  for (let i = 0; i < loops.length; ++i) {
    for (let j = 0; j < loops[i].length; ++j) {
      if (isPartOfLoop(i, j)) {
        loopAt[i][j] = true;
      }
    }
  }

  // replace the S with the right pipe
  const [x, y] = startPos;
  if (loopAt[x - 1]?.[y] && loopAt[x + 1]?.[y]) {
    grid[x][y] = "|";
  } else if (loopAt[x]?.[y - 1] && loopAt[x]?.[y + 1]) {
    grid[x][y] = "-";
  } else if (loopAt[x - 1]?.[y] && loopAt[x]?.[y + 1]) {
    grid[x][y] = "L";
  } else if (loopAt[x - 1]?.[y] && loopAt[x]?.[y - 1]) {
    grid[x][y] = "J";
  } else if (loopAt[x + 1]?.[y] && loopAt[x]?.[y - 1]) {
    grid[x][y] = "7";
  } else if (loopAt[x + 1]?.[y] && loopAt[x]?.[y + 1]) {
    grid[x][y] = "F";
  }

  return { grid, loops, loopAt };
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const { grid, loopAt } = solve(input);
  let countInside = 0,
    isInsideLR = false,
    isInsideUD = grid[0].map(() => false),
    lastSymbolLR = "|",
    lastSymbolUD = "-".repeat(grid[0].length).split("");
  for (let i = 0; i < loopAt.length; ++i) {
    lastSymbolLR = "|";
    isInsideLR = false;
    for (let j = 0; j < loopAt[i].length; ++j) {
      if (loopAt[i][j]) {
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
          // lastSymbolLR = lastSymbolUD[j] = grid[i][j];
        }
        continue;
      }

      if (isInsideLR && isInsideUD[j]) {
        // console.log(i, j, grid[i][j]);
        countInside += 1;
      }
    }
  }

  return countInside;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input.map((r) => r.split(""));
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
