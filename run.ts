const folder = process.argv[2];
const inputFile = process.argv[3] || `${folder}/input.txt`;

const solutions = require(`./${folder}/index.ts`);
const { solve1: _solve1 = () => {}, solve2: _solve2 = () => {} } = solutions;

const input = require("fs").readFileSync(inputFile, "utf8").split("\n");
console.log("solve1 result: ", _solve1(input));
console.log("solve2 result: ", _solve2(input));
