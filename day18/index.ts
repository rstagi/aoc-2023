/// <reference path="../types/globals.d.ts" />

import { shoelaceFormula } from "../utils/math";

// Note: gets trimmed
export const inputs = [
  `
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
`,
];

export function main() {
  const input = getInput(0);
  // Part 1
  const instructions = input
    .split("\n")
    .map((l) => l.replace(new RegExp("[()#]", "g"), "").split(" "));

  const instructionsBase10 = instructions.map(([dir, steps]) => ({
    dir: dir as "R" | "D" | "L" | "U",
    steps: parseInt(steps, 10),
  }));
  sol1(calcArea(instructionsBase10));

  // Part 2
  const hexToDir = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
  };
  const instructionsBase16 = instructions.map(([, , hex]) => ({
    dir: hexToDir[hex[5]],
    steps: parseInt(hex.substring(0, 5), 16),
  }));
  sol2(calcArea(instructionsBase16));
}

function calcArea(
  instructions: { dir: "R" | "D" | "L" | "U"; steps: number }[],
) {
  const vertexes: { x: number; y: number }[] = [
    {
      x: 0,
      y: 0,
    },
  ];

  let curX = 0,
    curY = 0,
    perimeter = 0;
  for (const { dir, steps } of instructions) {
    switch (dir) {
      case "R":
        curX += steps;
        break;
      case "D":
        curY += steps;
        break;
      case "L":
        curX -= steps;
        break;
      case "U":
        curY -= steps;
        break;
    }
    vertexes.push({ x: curX, y: curY });
    perimeter += steps;
  }

  return shoelaceFormula(vertexes) + perimeter / 2 + 1;
}
