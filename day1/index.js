const { readLines } = require("../shared/utils");

const result = solve(readLines());
console.log(result);

/* SOLUTION */
function solve(input) {
  return input.reduce((sum, line) => {
    const digits = getDigitsOr(line, [0]);
    return sum + parseInt([digits[0], digits.pop()].join(""));
  }, 0);
}

function getDigitsOr(line, fallback) {
  const rules = [
    { matches: ["zero", "0"], then: 0 },
    { matches: ["one", "1"], then: 1 },
    { matches: ["two", "2"], then: 2 },
    { matches: ["three", "3"], then: 3 },
    { matches: ["four", "4"], then: 4 },
    { matches: ["five", "5"], then: 5 },
    { matches: ["six", "6"], then: 6 },
    { matches: ["seven", "7"], then: 7 },
    { matches: ["eight", "8"], then: 8 },
    { matches: ["nine", "9"], then: 9 },
  ];

  const digits = [];
  for (let i = 0; i < line.length; ++i) {
    const rule = rules.find(({ matches }) =>
      matches.some((val) => line.startsWith(val, i)),
    );

    if (rule) digits.push(rule.then);
  }
  return digits.length ? digits : fallback;
}
