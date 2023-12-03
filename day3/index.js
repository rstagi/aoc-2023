/* CHALLENGE 1 */
function solve1(input) {
  const { numbers, symbols } = parseInput(input);

  const symbolsAroundLine = (index) => elementsAroundLine(index, symbols);
  const withSymbolsAround = (number) =>
    symbolsAroundLine(number.line).some(isAround(number.range));

  const parts = numbers.filter(withSymbolsAround);

  return parts.reduce(sum("value"), 0);
}

/* CHALLENGE 2 */
function solve2(input) {
  const { symbols, numbers } = parseInput(input);

  const numbersAroundLine = (index) => elementsAroundLine(index, numbers);
  const addCloseNumbers = (symbolInfo) => ({
    ...symbolInfo,
    numbersAroundSymbol: numbersAroundLine(symbolInfo.line).filter((num) =>
      isPosAroundRange(symbolInfo.pos, num.range),
    ),
  });

  const gears = symbols
    .filter(hasGearSymbol)
    .map(addCloseNumbers)
    .filter(isGear)
    .map(calcRatio);

  return gears.reduce(sum("ratio"), 0);
}

function hasGearSymbol(symbolInfo) {
  return symbolInfo.symbol === "*";
}

function isGear(potentialGear) {
  return potentialGear.numbersAroundSymbol.length === 2;
}

function calcRatio(gear) {
  const [n1, n2] = gear.numbersAroundSymbol;
  return {
    ...gear,
    ratio: n1.value * n2.value,
  };
}

/* SHARED */

/* Input parsing */
function parseInput(input) {
  const numbers = input.flatMap(numbersInLine);
  const symbols = input.flatMap(symbolsInLine);
  return { numbers, symbols };
}

function numbersInLine(line, index) {
  const foundNumbers = [];

  let currNumDigits = [];
  for (let i = 0; i < line.length; i++) {
    if (!isNaN(parseInt(line[i]))) {
      currNumDigits.push(line[i]);
    } else {
      if (currNumDigits.length) {
        foundNumbers.push(
          numberInfo(i - currNumDigits.length, currNumDigits, index),
        );
        currNumDigits = [];
      }
    }
  }
  if (currNumDigits.length) {
    foundNumbers.push(
      numberInfo(line.length - currNumDigits.length, currNumDigits, index),
    );
  }
  return foundNumbers;
}

function numberInfo(startsAt, digits, lineIndex) {
  return {
    value: parseInt(digits.join("")),
    range: [startsAt, startsAt + digits.length - 1],
    line: lineIndex,
  };
}

function symbolsInLine(line, index) {
  const foundSymbols = [];
  for (let i = 0; i < line.length; i++) {
    if (isNaN(parseInt(line[i])) && line[i] !== ".") {
      foundSymbols.push({ line: index, pos: i, symbol: line[i] });
    }
  }
  return foundSymbols;
}

/* Utils */
function sum(field) {
  return (sum, el) => sum + el[field];
}

function elementsAroundLine(index, elementsList) {
  return elementsList.filter(
    (el) => index - 1 <= el.line && el.line <= index + 1,
  );
}

function isAround([start, end]) {
  return ({ pos }) => isPosAroundRange(pos, [start, end]);
}

function isPosAroundRange(pos, [start, end]) {
  return start - 1 <= pos && pos <= end + 1;
}

module.exports = { solve1, solve2 };
