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

const sol = `
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

`
#######
#.....#
###...#
..#...#
..#...#
###.###
#...#..
##..###
.#....#
.######
`;

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const digInfo = parseInput(input);

  let offsetX = 0,
    offsetY = 0,
    offsetXDir: Direction,
    offsetYDir: Direction,
    minX = Infinity,
    maxX = 0,
    minY = Infinity,
    maxY = 0;
  for (const { dir, meters } of digInfo) {
    const direction = dirMap[dir];
    if (direction === "right" || direction === "left") {
      if (!offsetXDir) {
        offsetXDir = direction;
      }
      offsetX += direction === offsetXDir ? meters : -meters;
    } else {
      if (!offsetYDir) {
        offsetYDir = direction;
      }
      offsetY += direction === offsetYDir ? meters : -meters;
    }

    minX = Math.min(minX, offsetX);
    maxX = Math.max(maxX, offsetX);
    minY = Math.min(minY, offsetY);
    maxY = Math.max(maxY, offsetY);
  }

  console.log(minX, maxX, minY, maxY, (maxX - minX + 1) * (maxY - minY + 1));

  // visitDigPlan(digInfo, (x, y, currDir, meters) => {
  //   if (currDir === offsetDir) {
  //     offset += meters;
  //   } else if (currDir === opposite(offsetDir)) {
  //     offset -= meters;
  //   }
  // });
}

function opposite(dir: Direction): Direction {
  const oppositesMap = {
    right: "left",
    left: "right",
    up: "down",
    down: "up",
  } as const;
  return oppositesMap[dir];
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  // console.log(parsedInput);
  const {} = parsedInput;

  return 42;
}

/* SHARED */
type DigPlanInfo = {
  dir: keyof typeof dirMap;
  meters: number;
  color: string;
};
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
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
  fn: (
    start: __grids.Coordinate,
    end: __grids.Coordinate,
    direction: Direction,
    meters: number,
  ) => void,
) {
  let curr = { x: 0, y: 0 };
  for (const { dir, meters } of digPlan) {
    const dirKey = dirMap[dir];
    const next = __grids.move[dirKey](curr, meters);
    fn(curr, next, dirKey, meters);
    curr = next;
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
