import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);
  console.log(parsedInput);
  const {} = parsedInput;

  return 42;
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
  return input;
}

export const __forceInput = {
  force: true,
  input: `

`.trim(),
};
