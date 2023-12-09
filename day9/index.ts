import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);

  const interpolated = parsedInput.map(toInterpolatedValue);

  return interpolated.reduce(...__reducers.sum);
}

function toInterpolatedValue(input: number[]) {
  const seqs = allSeqs(input);

  seqs[seqs.length - 1].push(0);
  for (let i = seqs.length - 2; i >= 0; --i) {
    seqs[i].push(seqs[i + 1][seqs[i].length - 1] + seqs[i][seqs[i].length - 1]);
  }

  return seqs[0][seqs[0].length - 1];
}

function allSeqs(input: number[]) {
  const seqs = [input];

  let lastSeq = input,
    currSeq = [];
  while (lastSeq.some((v) => v !== 0)) {
    for (let i = 1; i < lastSeq.length; ++i) {
      currSeq.push(lastSeq[i] - lastSeq[i - 1]);
    }
    seqs.push(currSeq);
    lastSeq = currSeq;
    currSeq = [];
  }

  return seqs;
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);

  const interpolated = parsedInput.map(toInterpolatedValue2);
  return interpolated.reduce(...__reducers.sum);
}

function toInterpolatedValue2(input: number[]) {
  const seqs = allSeqs(input).map((s) => s.reverse());
  console.log(seqs);

  seqs[seqs.length - 1].push(0);
  for (let i = seqs.length - 2; i >= 0; --i) {
    seqs[i].push(
      -seqs[i + 1][seqs[i].length - 1] + seqs[i][seqs[i].length - 1],
    );
  }

  return seqs[0][seqs[0].length - 1];
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input.map((i) => __input.listOfNums(i));
}

export const __forceInput = {
  // force: true,
  input: `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim(),
};
