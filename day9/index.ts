import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);
  const interpolatedNext = parsedInput
    .map(toInterpolatedValues)
    .map((v) => v.next);
  return interpolatedNext.reduce(...__reducers.sum);
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  const interpolatedPrev = parsedInput
    .map(toInterpolatedValues)
    .map((v) => v.prev);
  return interpolatedPrev.reduce(...__reducers.sum);
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input.map((i) => __input.listOfNums(i));
}

function toInterpolatedValues(input: number[]) {
  const diffSeqs = allDiffSequences(input);

  diffSeqs[diffSeqs.length - 1].push(0);
  for (let i = diffSeqs.length - 2; i >= 0; --i) {
    diffSeqs[i].push(
      diffSeqs[i + 1][diffSeqs[i].length - 1] +
        diffSeqs[i][diffSeqs[i].length - 1],
    );
  }

  const revDiffSeqs = diffSeqs.map((s) => s.reverse());
  revDiffSeqs[revDiffSeqs.length - 1].push(0);
  for (let i = revDiffSeqs.length - 2; i >= 0; --i) {
    revDiffSeqs[i].push(
      -revDiffSeqs[i + 1][revDiffSeqs[i].length - 1] +
        revDiffSeqs[i][revDiffSeqs[i].length - 1],
    );
  }

  const interpolatedDiffSeqs = revDiffSeqs.map((s) => s.reverse());

  return {
    prev: interpolatedDiffSeqs[0][0],
    next: interpolatedDiffSeqs[0][interpolatedDiffSeqs[0].length - 1],
  };
}

function allDiffSequences(input: number[]) {
  const seqs = [input];

  // Until the last sequence is all 0s
  let lastSeq = input;
  while (lastSeq.some((v) => v !== 0)) {
    lastSeq = diffSequence(lastSeq);
    seqs.push(lastSeq);
  }

  return seqs;
}

function diffSequence(input: number[]) {
  const seq = [];
  for (let i = 1; i < input.length; ++i) {
    seq.push(input[i] - input[i - 1]);
  }
  return seq;
}

export const __forceInput = {
  // force: true,
  input: `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim(),
};
