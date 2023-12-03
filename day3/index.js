/* CHALLENGE 1 */
function solve1(input) {
  const { partNumbers } = getEngineSpecs(input);
  return partNumbers.reduce((sum, num) => sum + num, 0);
}

/* CHALLENGE 2 */
function solve2(input) {}

function getEngineSpecs(input) {
  const isSymbol = (i, j) =>
    Boolean(
      0 <= i &&
        i < input.length &&
        0 <= j &&
        j < input[i].length &&
        isNaN(parseInt(input[i][j])) &&
        input[i][j] !== ".",
    );

  const isCloseToSymbol = (i, j) =>
    isSymbol(i - 1, j - 1) ||
    isSymbol(i - 1, j) ||
    isSymbol(i - 1, j + 1) ||
    isSymbol(i, j - 1) ||
    isSymbol(i, j + 1) ||
    isSymbol(i + 1, j - 1) ||
    isSymbol(i + 1, j) ||
    isSymbol(i + 1, j + 1);

  const partNumbers = [];

  for (let i = 0; i < input.length; i++) {
    let isInNumber = false,
      isNumberCloseToSymbol = false;
    const currNum = [];
    for (let j = 0; j < input[i].length; j++) {
      if (!isNaN(parseInt(input[i][j]))) {
        currNum.push(input[i][j]);
        isInNumber = true;
      } else {
        if (isInNumber && isNumberCloseToSymbol) {
          partNumbers.push(parseInt(currNum.join("")));
        }
        currNum.splice(0, currNum.length);
        isInNumber = false;
        isNumberCloseToSymbol = false;
        continue;
      }

      isNumberCloseToSymbol |= isCloseToSymbol(i, j);
    }

    if (isInNumber && isNumberCloseToSymbol) {
      partNumbers.push(parseInt(currNum.join("")));
    }
  }

  return { partNumbers };
}

module.exports = { solve1, solve2 };
