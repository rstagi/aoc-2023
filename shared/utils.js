const fs = require("fs");

function readLines() {
  return fs.readFileSync(process.argv[2], "utf8").split("\n");
}

/**
 * This function is used to run the solution for the given day.
 * @param {function} solve
 * @returns {void}
 * @example run((input) => ({ challenge1: 1, challenge2: 2 }));
 */
function run(solve1 = () => "undefined", solve2 = () => "undefined") {
  const input = readLines();
  console.log(
    JSON.stringify(
      { challenge1: solve1(input), challenge2: solve2(input) },
      null,
      2,
    ),
  );
}

module.exports = {
  run,
};
