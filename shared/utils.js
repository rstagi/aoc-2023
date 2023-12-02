const fs = require("fs");

/**
 * Returns an array of lines from the file specified as first argument.
 * @returns {string[]}
 */
function readLines() {
  return fs.readFileSync(process.argv[2], "utf8").split("\n");
}

module.exports = {
  readLines,
};
