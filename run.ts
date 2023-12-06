const folder = process.argv[2];

const inputFileArg = process.argv[3];
const inputFile =
  inputFileArg && !isNaN(parseInt(inputFileArg))
    ? `./${folder}/input${inputFileArg}.txt`
    : inputFileArg ?? `./${folder}/input.txt`;

const solutions = require(`./${folder}/index.ts`);
const {
  solve1: _solve1 = () => {},
  solve2: _solve2 = () => {},
  __forceInput = { force: false, input: "" },
} = solutions;

const input = __forceInput.force
  ? (__forceInput.input || "").split("\n")
  : require("fs").readFileSync(inputFile, "utf8").split("\n");
console.log("solve1 result: ", _solve1(input));
console.log("solve2 result: ", _solve2(input));
