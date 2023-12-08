import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);
  const { directions, nodes } = parsedInput;

  let i = 0,
    currNode = "AAA",
    steps = 0;
  while (currNode !== "ZZZ") {
    const direction = directions[i];
    if (direction === "R") {
      currNode = nodes[currNode].right;
    } else if (direction === "L") {
      currNode = nodes[currNode].left;
    }
    steps += 1;
    i = (i + 1) % directions.length;
  }

  return steps;
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  const { directions, nodes } = parsedInput;

  let i = 0,
    currNodes = Object.keys(nodes).filter((n) => n.endsWith("A"));

  const stepsForEachNode = currNodes.map((n) => {
    let steps = 0,
      currNode = n;
    while (!currNode.endsWith("Z")) {
      const direction = directions[i];
      if (direction === "R") {
        currNode = nodes[currNode].right;
      } else if (direction === "L") {
        currNode = nodes[currNode].left;
      }
      steps += 1;
      i = (i + 1) % directions.length;
    }
    return steps;
  });

  const minSteps = stepsForEachNode.reduce(
    (r, n) => lcm(n, r),
    stepsForEachNode[0],
  );

  return minSteps;
}

function lcm(x: number, y: number) {
  return (x * y) / gcd(x, y);
}

function gcd(x: number, y: number) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  const directions = input[0];

  input.splice(0, 2);
  const nodes = {};
  for (let i = 0; i < input.length; ++i) {
    const [name, value] = input[i].split(" = ");
    if (!name || !value) continue;
    const [left, right] = value
      .split(", ")
      .map((v) => v.replace("(", "").replace(")", ""));
    nodes[name] = { left, right };
  }

  return { directions, nodes };
}

export const __forceInput = {
  // force: true,
  input: `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`.trim(),
};
