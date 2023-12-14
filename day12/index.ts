import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";

// /* CHALLENGE 1 */
export function solve1(input: string[]) {
  const springsInfo = parseInput(input);
  const ways = springsInfo.map((si) =>
    countWaysRec(
      si.row,
      si.damagedGroups,
      0,
      si.damagedGroups.reduce(...__reducers.sum),
    ),
  );

  return ways.reduce(...__reducers.sum);
}

// const args: [string, number[]] = [".?.#??#?.?", [1, 3]];
//
// console.log("ROW:", args[0], "GROUPS:", args[1], "\n");
// console.log(
//   countWaysRec(args[0], args[1], 0, args[1].reduce(...__reducers.sum)),
// );
// console.log(countWays({ row: args[0], damagedGroups: args[1] }));

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const springsInfo = parseInput(input);
  const unfoldedSpringsInfo = springsInfo.map(({ row, damagedGroups }) => ({
    row: `${row}?`.repeat(5).slice(0, -1),
    damagedGroups: `${damagedGroups.join(",")},`
      .repeat(5)
      .slice(0, -1)
      .split(",")
      .map((group) => parseInt(group, 10))
      .filter((group) => !isNaN(group)),
  }));

  const ways = unfoldedSpringsInfo.map((si, i) => {
    console.log(i);
    return countWaysRec(
      si.row,
      si.damagedGroups,
      0,
      si.damagedGroups.reduce(...__reducers.sum),
    );
  });
  return ways.reduce(...__reducers.sum);
}
//
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

function countWaysRec(
  row: string,
  groups: number[],
  currPos: number,
  totDamagedSprings: number,
) {
  if (groups.length === 0) {
    let currDamagedSprings = 0;
    for (let i = 0; i < row.length; ++i) {
      if (row[i] === "#") {
        currDamagedSprings += 1;
      }
    }
    // console.log(row, currDamagedSprings, totDamagedSprings);
    return currDamagedSprings === totDamagedSprings ? 1 : 0;
  }

  const neededCells = groups.reduce(...__reducers.sum) + groups.length - 1;
  if (currPos + neededCells > row.length) {
    return 0;
  }

  const [currGroup, ...restGroups] = groups;
  const starts = findUsableStarts(
    row,
    currPos,
    currGroup,
    row.length - neededCells,
  );

  // console.log(currPos, currGroup, starts, groups.length, neededCells);
  let ways = 0;
  for (const start of starts) {
    const newRow =
      row.substring(0, start).replace(new RegExp("\\?", "g"), ".") +
      "#".repeat(currGroup) +
      row.substring(start + currGroup);
    ways += countWaysRec(
      newRow,
      restGroups,
      start + currGroup + 1,
      totDamagedSprings,
    );
  }

  return ways;
}

function findUsableStarts(
  row: string,
  currPos: number,
  currGroup: number,
  limit: number,
) {
  const starts = [];
  while (currPos <= limit) {
    const cells = row.substring(currPos, currPos + currGroup);
    let foundAnchor = false;
    if (
      row[currPos - 1] !== "#" &&
      !cells.includes(".") &&
      row[currPos + currGroup] !== "#"
    ) {
      if (!foundAnchor && cells.includes("#")) {
        foundAnchor = true;
        limit = Math.min(currPos + cells.indexOf("#"), limit);
      }
      starts.push(currPos);
    }
    currPos++;
  }

  return starts;
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
