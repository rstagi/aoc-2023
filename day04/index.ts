export const inputs = [
  `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`,
  `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`,
];

export function main() {
  const input = getInput(0).split("\n");

  // Part 1
  let total = 0;
  for (const line of input) {
    let totLine = 0;
    const [_, info] = line.split(": ");
    if (!info) continue;
    const [winning, numbers] = info.split(" | ");

    const winninNums = winning
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));
    const numbersNums = numbers
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));

    const winningNumsMap = {};
    for (const num of winninNums) {
      winningNumsMap[num] = true;
    }

    for (const num of numbersNums) {
      if (winningNumsMap[num]) {
        totLine = totLine === 0 ? 1 : totLine * 2;
      }
    }

    total += totLine;
  }

  sol1(total);

  // Part 2
  total = 0;

  const multipliers = input.filter((l) => l).map(() => 1);
  for (let i = 0; i < input.length; i++) {
    const line = input[i];

    let totLine = 0;
    const [_, info] = line.split(": ");

    if (!info) continue;
    const [winning, numbers] = info.split(" | ");

    const winninNums = winning
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));
    const numbersNums = numbers
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n));

    const winningNumsMap = {};
    for (const num of winninNums) {
      winningNumsMap[num] = true;
    }

    for (const num of numbersNums) {
      if (winningNumsMap[num]) {
        totLine++;
      }
    }

    if (totLine === 0) continue;

    for (let j = i + 1; j <= i + totLine; j++) {
      multipliers[j] += multipliers[i];
    }
  }
  sol2(Object.values(multipliers).reduce((sum, n) => sum + n, 0));
}
