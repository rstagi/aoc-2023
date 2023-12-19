import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

const dirMap = {
  R: "right",
  L: "left",
  U: "up",
  D: "down",
} as const;
type Direction = "right" | "left" | "up" | "down";
type Sense = "clockwise" | "counterclockwise";
type Edge = "top" | "bottom" | "left" | "right";

`
XXXXXX#
XXXXXX#
##XXXX#
..XXXX#
..XXXX#
XXXX###
XXXX#..
#XXXXX#
.XXXXX#
.######
`;

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const digInfo = parseInput(input);

  const vertexes: __grids.Coordinate[] = [{ x: 0, y: 0 }];

  const sense = getSense(digInfo);

  let lastDir = dirMap[digInfo[0].dir];
  let currEdge = getNextEdge(lastDir, sense);
  let rightOrBottomEdges = 0;
  visitDigPlan(digInfo, (x, y, currDir) => {
    if (lastDir !== currDir) {
      vertexes.push({ x, y });
      const nextEdge = getNextEdge(currDir, sense);
      if (
        (["right", "bottom"].includes(currEdge) &&
          ["right", "bottom"].includes(nextEdge)) ||
        (currDir === "up" && nextEdge === "bottom") ||
        (currDir === "left" && nextEdge === "right") ||
        (currDir === "down" && nextEdge === "top")
      ) {
        console.log("-", currEdge, { x, y });
        rightOrBottomEdges--;
      }

      currEdge = nextEdge;
      lastDir = currDir;
    }
    if (currEdge === "right" || currEdge === "bottom") {
      console.log("+", currEdge, { x, y });
      rightOrBottomEdges += 1;
    }
  });

  const innerArea = __math.shoelaceFormula(vertexes);
  console.log(vertexes, rightOrBottomEdges, innerArea);

  return innerArea + rightOrBottomEdges;

  // let maxX = 0,
  //   maxY = 0,
  //   minX = Infinity,
  //   minY = Infinity;
  // visitDigPlan(digInfo, (x, y) => {
  //   maxX = Math.max(maxX, x);
  //   maxY = Math.max(maxY, y);
  //   minX = Math.min(minX, x);
  //   minY = Math.min(minY, y);
  // });
  //
  // const grid = __grids.createGrid(maxY - minY + 1, maxX - minX + 1, () => ".");
  // let lastDir = "none",
  //   startPos = { x: 0, y: 0 };
  // visitDigPlan(digInfo, (x, y, currDir) => {
  //   x -= minX;
  //   y -= minY;
  //   if (lastDir === currDir) {
  //     __grids.set(grid, { x, y }, ["up", "down"].includes(currDir) ? "|" : "-");
  //     return;
  //   }
  //
  //   if (lastDir === "none") {
  //     __grids.set(grid, { x, y }, "7");
  //     startPos = { x, y };
  //   } else if (
  //     (lastDir === "up" && currDir === "right") ||
  //     (lastDir === "left" && currDir === "down")
  //   ) {
  //     __grids.set(grid, { x, y }, "F");
  //   } else if (
  //     (lastDir === "up" && currDir === "left") ||
  //     (lastDir === "right" && currDir === "down")
  //   ) {
  //     __grids.set(grid, { x, y }, "7");
  //   } else if (
  //     (lastDir === "down" && currDir === "right") ||
  //     (lastDir === "left" && currDir === "up")
  //   ) {
  //     __grids.set(grid, { x, y }, "L");
  //   } else if (
  //     (lastDir === "down" && currDir === "left") ||
  //     (lastDir === "right" && currDir === "up")
  //   ) {
  //     __grids.set(grid, { x, y }, "J");
  //   }
  //   lastDir = currDir;
  // });
  //
  // __grids.print(grid);
  //
  // let countInside = 0,
  //   isInsideLR = false,
  //   isInsideUD = grid[0].map(() => false),
  //   lastSymbolLR = "|",
  //   lastSymbolUD = "-".repeat(grid[0].length).split("");
  // for (let i = 0; i < grid.length; ++i) {
  //   lastSymbolLR = "|";
  //   isInsideLR = false;
  //   for (let j = 0; j < grid[i].length; ++j) {
  //     if (grid[i][j] !== ".") {
  //       countInside += 1;
  //       if (grid[i][j] === "|") {
  //         isInsideLR = !isInsideLR;
  //         lastSymbolLR = "|";
  //       } else if (grid[i][j] === "-") {
  //         isInsideUD[j] = !isInsideUD[j];
  //         lastSymbolUD[j] = "-";
  //       } else {
  //         if (
  //           lastSymbolLR === "|" ||
  //           lastSymbolLR === grid[i][j] ||
  //           (lastSymbolLR === "F" && grid[i][j] === "7") ||
  //           (lastSymbolLR === "7" && grid[i][j] === "F") ||
  //           (lastSymbolLR === "J" && grid[i][j] === "L") ||
  //           (lastSymbolLR === "L" && grid[i][j] === "J")
  //         ) {
  //           isInsideLR = !isInsideLR;
  //           lastSymbolLR = grid[i][j];
  //         }
  //         if (
  //           lastSymbolUD[j] === "-" ||
  //           lastSymbolUD[j] === grid[i][j] ||
  //           (lastSymbolUD[j] === "7" && grid[i][j] === "J") ||
  //           (lastSymbolUD[j] === "J" && grid[i][j] === "7") ||
  //           (lastSymbolUD[j] === "F" && grid[i][j] === "L") ||
  //           (lastSymbolUD[j] === "L" && grid[i][j] === "F")
  //         ) {
  //           isInsideUD[j] = !isInsideUD[j];
  //           lastSymbolUD[j] = grid[i][j];
  //         }
  //       }
  //       continue;
  //     }
  //
  //     if (isInsideLR && isInsideUD[j]) {
  //       countInside += 1;
  //     }
  //   }
  // }

  // return countInside;
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
type DigPlanInfo = {
  dir: keyof typeof dirMap;
  meters: number;
  color: string;
};
function parseInput(input: string[]): DigPlanInfo[] {
  return input
    .filter((r) => r && r.length > 0)
    .map((r) => r.split(" "))
    .map(([dir, meters, color]) => ({
      dir: dir as keyof typeof dirMap,
      meters: parseInt(meters),
      color: color.replace("(", "").replace(")", ""),
    }));
}

function visitDigPlan(
  digPlan: DigPlanInfo[],
  fn: (x: number, y: number, currDir: Direction) => void,
) {
  let curr = { x: 0, y: 0 };
  for (const { dir, meters } of digPlan) {
    for (let i = 0; i <= meters; i++) {
      fn(curr.x, curr.y, dirMap[dir]);
      if (i < meters) {
        curr = __grids.move[dirMap[dir]](curr);
      }
    }
  }
}

function getSense(digPlan: DigPlanInfo[]) {
  const firstDir = digPlan[0].dir;
  const lastDir = digPlan[digPlan.length - 1].dir;

  switch (`${firstDir}${lastDir}`) {
    case "RU":
    case "DR":
    case "UL":
    case "LD":
      return "clockwise";

    case "RD":
    case "DL":
    case "UR":
    case "LU":
      return "counterclockwise";

    default:
      console.error("Invalid input:", firstDir, lastDir);
      process.exit(1);
  }
}

function getNextEdge(currDir: Direction, sense: Sense): Edge {
  if (sense === "clockwise") {
    switch (currDir) {
      case "up":
        return "left";
      case "down":
        return "right";
      case "left":
        return "bottom";
      case "right":
        return "top";
    }
  } else {
    switch (currDir) {
      case "up":
        return "right";
      case "down":
        return "left";
      case "left":
        return "top";
      case "right":
        return "bottom";
    }
  }
}

export const __forceInput = {
  force: true,
  input: `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`.trim(),
};
