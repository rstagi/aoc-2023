export const inputs = [
  `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`,
  `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`,
];

export function main() {
  const input = getInput(0).split("\n");

  sol1(
    input.reduce((sum, line) => {
      const rules: Rule[] = [
        { matches: ["0"], then: 0 },
        { matches: ["1"], then: 1 },
        { matches: ["2"], then: 2 },
        { matches: ["3"], then: 3 },
        { matches: ["4"], then: 4 },
        { matches: ["5"], then: 5 },
        { matches: ["6"], then: 6 },
        { matches: ["7"], then: 7 },
        { matches: ["8"], then: 8 },
        { matches: ["9"], then: 9 },
      ];
      const digits = getDigitsOr(line, rules, [0]);
      return sum + parseInt([digits[0], digits.pop()].join(""));
    }, 0),
  );

  sol2(
    input.reduce((sum, line) => {
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
      const digits = getDigitsOr(line, rules, [0]);
      return sum + parseInt([digits[0], digits.pop()].join(""));
    }, 0),
  );
}

type Rule = {
  matches: string[];
  then: number;
};
function getDigitsOr(line: string, rules: Rule[], fallback: number[]) {
  const digits = <number[]>[];
  for (let i = 0; i < line.length; ++i) {
    const rule = rules.find(({ matches }) =>
      matches.some((val) => line.startsWith(val, i)),
    );

    if (rule) digits.push(rule.then);
  }
  return digits.length ? digits : fallback;
}
