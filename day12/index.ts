import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const springsInfo = parseInput(input);
  const ways = springsInfo.map(countWays);
  return ways.reduce(...__reducers.sum);
}

/* CHALLENGE 2 */
// export function solve2(input: string[]) {
//   const springsInfo = parseInput(input);
//   const unfoldedSpringsInfo = springsInfo.map(({ row, damagedGroups }) => ({
//     row: `${row}X`.repeat(5).slice(0, -1),
//     damagedGroups,
//   }));
//
//   const ways = unfoldedSpringsInfo.map(countWays);
//   return ways.reduce(...__reducers.sum);
// }

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input
    .filter((line) => line.length > 0)
    .map((line) => line.split(" "))
    .map(([row, damageInfo]) => ({
      row: row.trim(),
      damagedGroups: damageInfo
        .split(",")
        .map((group) => parseInt(group, 10))
        .filter((group) => !isNaN(group)),
    }));
}

function countWays({
  row,
  damagedGroups,
}: {
  row: string;
  damagedGroups: number[];
}) {
  const [controlRow] = row.split("X");

  const unknowns = [];
  for (let i = 0; i < controlRow.length; ++i) {
    if (controlRow[i] === "?") {
      unknowns.push(i);
    }
  }

  let ways = 0,
    validRow = "";
  for (let i = 0; i < Math.pow(2, unknowns.length); ++i) {
    const currRow = controlRow.split("");
    for (let j = 0; j < unknowns.length; ++j) {
      currRow[unknowns[j]] = i & (1 << j) ? "#" : ".";
    }
    if (isCorrect(currRow.join(""), damagedGroups)) {
      ways += 1;
      validRow = currRow.join("");
    }
  }
  // console.log(validRow, controlRow, damagedGroups, ways);

  return ways;
}

function isCorrect(row: string, damagedGroups: number[]) {
  const currGroups = row.split(".").filter((group) => group.length > 0);
  if (currGroups.length !== damagedGroups.length) {
    return false;
  }

  return currGroups.every((group, i) => group.length === damagedGroups[i]);
}

export const __forceInput = {
  // force: true,
  input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim(),
};
