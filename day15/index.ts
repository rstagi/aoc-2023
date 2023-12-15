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
    const cmd = parseLensInfo(lensInfo);
    const { box, lensSlot, foundLens } = getLensInBox(cmd.lens);

    switch (cmd.type) {
      case "delete":
        if (foundLens) box.splice(lensSlot, 1);
        break;
      case "add":
        if (foundLens) {
          box[lensSlot][1] = cmd.focalLength;
        } else {
          box.push([cmd.lens, cmd.focalLength]);
        }
        break;
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

  function parseLensInfo(
    lensInfo: string,
  ):
    | { type: "delete"; lens: string }
    | { type: "add"; lens: string; focalLength: number } {
    if (lensInfo.includes("=")) {
      const [lens, focalLength] = lensInfo.split("=");
      return { type: "add", lens, focalLength: parseInt(focalLength) };
    } else if (lensInfo.includes("-")) {
      const [lens] = lensInfo.split("-");
      return { type: "delete", lens };
    }
  }

  function getLensInBox(lens: string) {
    const box = getBox(lens);
    const lensSlot = box.findIndex(isLens(lens));
    return {
      box,
      lensSlot,
      foundLens: lensSlot > -1,
    };
  }

  function getBox(lens: string): [string, number][] {
    const label = toHash(lens);
    if (!boxes.has(label)) {
      boxes.set(label, []);
    }
    return boxes.get(label);
  }

  function isLens(lens: string) {
    return (boxSlot: [string, number]) => boxSlot[0] === lens;
  }
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input[0].trim().split(",");
}

function toHash(input: string) {
  let currentValue = 0;
  for (let i = 0; i < input.length; i++) {
    currentValue += input.charCodeAt(i);
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
