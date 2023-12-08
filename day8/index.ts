import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);
  const { directions, nodes } = parsedInput;
  return countRequiredSteps({
    nodes,
    directions,
    startAt: "AAA",
    endAt: "ZZZ",
  });
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  const { directions, nodes } = parsedInput;

  // the start nodes are all the nodes that end with A
  const startNodes = Object.keys(nodes).filter((n) => n.endsWith("A"));

  // we need to find the number of steps to get to an end node from each start node
  const stepsForEachPath = startNodes.map((n) =>
    countRequiredSteps({
      nodes,
      directions,
      startAt: n,
      // an end node is a node that ends with Z
      endAt: (node) => node.endsWith("Z"),
    }),
  );

  // the min number of steps is the LCM of all the steps for each path from A to Z
  const minSteps = stepsForEachPath.reduce(...__reducers.lcm);
  return minSteps;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  const directions = input[0];

  const nodes = {};
  for (let i = 2; i < input.length; ++i) {
    const [name, value] = input[i].split(" = ");
    if (!name || !value) continue;
    const [left, right] = value
      .split(", ")
      .map((v) => v.replace("(", "").replace(")", ""));
    nodes[name] = { left, right };
  }

  return { directions, nodes };
}

type NodeMap = Record<string, { left: string; right: string }>;
function countRequiredSteps(opts: {
  nodes: NodeMap;
  directions: string;
  startAt: string;
  endAt: string | ((node: string) => boolean);
}) {
  const { nodes, directions, startAt, endAt } = opts;

  const endCondition =
    typeof endAt === "string" ? (node: string) => node === endAt : endAt;

  let i = 0,
    steps = 0,
    currNode = startAt;
  while (!endCondition(currNode)) {
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
