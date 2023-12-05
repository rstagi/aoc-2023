const folder = process.argv[2];
const inputFile = process.argv[3] || `${folder}/input.txt`;

const solutions = require(`./${folder}/index.js`);
const { solve1 = () => {}, solve2 = () => {} } = solutions;

const input = require("fs").readFileSync(inputFile, "utf8").split("\n");
console.log("solve1 result: ", solve1(input));
console.log("solve2 result: ", solve2(input));
