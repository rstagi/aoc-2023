const fs = require("fs");

const INPUT_FILE = "input.txt";

const input = fs.readFileSync(`${__dirname}/${INPUT_FILE}`, "utf8");
const output = calibrate(input);
console.log(output);

/* SOLUTION */
function calibrate(input) {
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

  return input.split("\n").reduce((sum, line) => {
    let firstNum, lastNum;
    for (let i = 0; i < line.length; ++i) {
      const rule = rules.find(({ matches }) =>
        matches.some((val) => line.startsWith(val, i)),
      );
      if (!rule) continue;

      lastNum = rule.then;
      if (firstNum === undefined) firstNum = lastNum;
    }

    return sum + parseInt(`${firstNum || 0}${lastNum || 0}`);
  }, 0);
}
