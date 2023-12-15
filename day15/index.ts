import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  return parseInput(input)
    .map(toHash)
    .reduce(...__reducers.sum);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);

  const boxes = new Map<number, [string, number][]>();
  for (const lensInfo of parsedInput) {
    if (lensInfo.includes("=")) {
      const [lens, focalLength] = lensInfo.split("=");

      const label = toHash(lens);
      const box = boxes.get(label);
      if (!box) {
        boxes.set(label, [[lens, parseInt(focalLength)]]);
        continue;
      }

      const existingLens = box.findIndex((x) => x[0] === lens);
      if (existingLens > -1) {
        box[existingLens][1] = parseInt(focalLength);
      } else {
        box.push([lens, parseInt(focalLength)]);
      }
    } else if (lensInfo.includes("-")) {
      const [lens] = lensInfo.split("-");
      const box = boxes.get(toHash(lens));
      const existingLens = box?.findIndex((x) => x[0] === lens);
      if (box && existingLens > -1) {
        box.splice(existingLens, 1);
      }
    }
  }

  return [...boxes.entries()]
    .map(([boxNumber, box]) => {
      let curr = 0;
      for (let slot = 0; slot < box.length; slot++) {
        const [, focalLength] = box[slot];
        curr += (boxNumber + 1) * (slot + 1) * focalLength;
      }
      return curr;
    })
    .reduce(...__reducers.sum);
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input[0].trim().split(",");
}

function toHash(input: string) {
  let currentValue = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
}

export const __forceInput = {
  // force: true,
  input: `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim(),
};
