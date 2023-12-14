import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";

/* CHALLENGE 1 */
const DEBUG = 5;
export function solve1(input: string[]) {
  const springsInfo = parseInput(input);
  const ways = springsInfo.map(countWays);
  return ways.reduce(...__reducers.sum);
}

/* CHALLENGE 2 */
// export function solve2(input: string[]) {
//   const springsInfo = parseInput(input);
//   const unfoldedSpringsInfo = springsInfo.map(({ row, damagedGroups }) => ({
//     row: `${row}?`.repeat(5).slice(0, -1),
//     damagedGroups: `${damagedGroups.join(",")},`
//       .repeat(5)
//       .slice(0, -1)
//       .split(",")
//       .map((group) => parseInt(group, 10))
//       .filter((group) => !isNaN(group)),
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

function countWaysR(
  startPos: number,
  group: number,
  row: string,
  damagedGroups: number[],
  countPointsInRange: number[][],
  canGroupStartAt: boolean[][],
): number {
  // console.log(startPos, group);
  if (group >= damagedGroups.length) {
    // console.log("returning 1\n");
    return 1;
  }

  if (startPos >= row.length) {
    // console.log("returning 0");
    return 0;
  }

  let groupStart = startPos;

  let ways = 0;
  for (; groupStart <= row.length - damagedGroups[group]; groupStart++) {
    while (
      groupStart <= row.length - damagedGroups[group] &&
      (!canGroupStartAt[group][groupStart] ||
        countPointsInRange[groupStart][damagedGroups[group]] > 0 ||
        (groupStart + damagedGroups[group] < row.length &&
          row[groupStart + damagedGroups[group]] === "#"))
    ) {
      canGroupStartAt[group][groupStart] = false;
      groupStart++;
    }
    //
    // console.log(
    //   startPos,
    //   group,
    //   groupStart,
    //   groupStart + damagedGroups[group] + 1,
    //   group + 1,
    // );

    if (groupStart > row.length - damagedGroups[group]) {
      break;
    }

    const count = countWaysR(
      groupStart + damagedGroups[group] + 1,
      group + 1,
      row,
      damagedGroups,
      countPointsInRange,
      canGroupStartAt,
    );

    if (count === 0) {
      canGroupStartAt[group][groupStart] = false;
      continue;
    }

    ways += count;
  }

  return ways;
}

function countWays({
  row,
  damagedGroups,
}: {
  row: string;
  damagedGroups: number[];
}) {
  const unknowns: number[] = [];
  for (let i = 0; i < row.length; ++i) {
    if (row[i] === "?") {
      unknowns.push(i);
    }
  }

  const canGroupStartAt: boolean[][] = damagedGroups.map(() =>
    row.split("").map(() => true),
  );

  const maxGroup = Math.max(...damagedGroups);
  const countPointsInRange: number[][] = row.split("").map(() => []);
  for (let i = 0; i < row.length; ++i) {
    let count = 0;
    for (let j = 0; j < maxGroup; ++j) {
      if (row[i + j] === ".") {
        count += 1;
      }
      countPointsInRange[i].push(count);
    }
  }

  const ways = countWaysR(
    0,
    0,
    row,
    damagedGroups,
    countPointsInRange,
    canGroupStartAt,
  );
  console.log(row, damagedGroups, ways);
  // console.log("");
  // let ways = 0;
  // for (let startPos = 0; startPos < row.length; startPos++) {
  //   let groupStart = startPos,
  //     isValid = true;
  //   for (let group = 0; group < damagedGroups.length; group++) {
  //     if (row.slice(groupStart, damagedGroups[group]).includes(".")) {
  //       canGroupStartAt[group][groupStart] = false;
  //       isValid = false;
  //       break;
  //     }
  //     groupStart += damagedGroups[group] + 1;
  //   }
  //   if (isValid) ways++;
  // }

  return ways;

  // const totalDamaged = damagedGroups.reduce(...__reducers.sum);
  // const alreadyDamaged = row.split("").filter((s) => s === "#").length;
  // const damageable = totalDamaged - alreadyDamaged;

  // console.log(
  //   row,
  //   damagedGroups,
  //   unknowns,
  //   totalDamaged,
  //   alreadyDamaged,
  //   damageable,
  // );

  // let ways = 0;
  // const visited: Record<string, boolean> = {};
  // for (let i = 0; i < Math.pow(2, unknowns.length); ++i) {
  //   let damaged = 0;
  //   const currRow = row.split("");
  //   for (let j = 0; j < unknowns.length; ++j) {
  //     const curr = i & (1 << j) && damaged < damageable ? "#" : ".";
  //     if (curr === "#") {
  //       damaged += 1;
  //     }
  //     currRow[unknowns[j]] = curr;
  //   }
  //   const damagedRow = currRow.join("");
  //   if (!visited[damagedRow] && isCorrect(damagedRow, damagedGroups)) {
  //     ways += 1;
  //   }
  //   visited[damagedRow] = true;
  // }
  // // console.log(row, damagedGroups, ways);
  //
  // return ways;
}

function isCorrect(row: string, damagedGroups: number[]) {
  const currGroups = row.split(".").filter((group) => group.length > 0);
  if (currGroups.length !== damagedGroups.length) {
    return false;
  }

  return currGroups.every((group, i) => group.length === damagedGroups[i]);
}

export const __forceInput = {
  force: true,
  input: `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim(),
};
