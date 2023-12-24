import { formatDay, getLastDayFromDir } from "./utils/aoc";
import * as _util from "node:util";

const dayName = process.argv[2] ?? formatDay(getLastDayFromDir());

const answers = {
  part1: undefined as number | undefined,
  part2: undefined as number | undefined,
};

declare global {
  var util: typeof _util;
  var getInput: (index: number) => string;
  var isCustomMode: () => boolean;
  var sol1: (solution: number) => void;
  var sol2: (solution: number) => void;
}

global.util = _util;

global.sol1 = (sol: number) => {
  console.info("Solved part 1:", sol);
  answers.part1 = sol;
};

global.sol2 = (sol: number) => {
  console.info("Solved part 2:", sol);
  answers.part2 = sol;
};

let runningInCustomMode: boolean;
global.isCustomMode = (): boolean => {
  return runningInCustomMode;
};

/**
 * Runs the solution with the custom input.
 */
function runWithCustomInput() {
  console.log("\nUsing custom input:");
  global.getInput = (index: number) => inputs[index].trim();
  runningInCustomMode = true;
  main();
}

/**
 * Runs the solution with the problem input, disabling `console.log`.
 * The developer can still use `console.debug` and `console.error`.
 */
function runWithProblemInput() {
  console.log("\nUsing problem input:");

  const { log } = console;
  console.log = () => {};

  global.getInput = (_index: number) =>
    require("fs").readFileSync(`./${dayName}/input.txt`, "utf8").trim();
  runningInCustomMode = false;
  main();

  console.log = log;
}

const { npm_config_custom_only, npm_config_problem_only } = process.env;
const { inputs, main } = require(`./${dayName}/index.js`);

console.log(`Running ${dayName}...`);

if (!npm_config_problem_only) {
  runWithCustomInput();
  console.log(answers);
}

if (!npm_config_custom_only) {
  runWithProblemInput();
  console.log(answers);
}
