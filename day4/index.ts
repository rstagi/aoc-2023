/* CHALLENGE 1 */
function solve1(input) {
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

  return total;
}

/* CHALLENGE 2 */
function solve2(input) {
  let total = 0;

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
  return Object.values(multipliers).reduce((sum, n) => sum + n, 0);
}

module.exports = { solve1, solve2 };
