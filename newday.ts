import fs from "fs";
import { exec } from "child_process";
import { formatDay, getLastDayFromDir } from "./utils/aoc";

const AOC_YEAR = 2023;

const inputDay = parseInt(process.argv[2]);
const dayNumber = isNaN(inputDay) ? getLastDayFromDir() + 1 : inputDay;

const dayName = formatDay(dayNumber);

console.log("Inintializing day", dayName);
if (fs.existsSync(`./${dayName}`)) {
  console.log("Day already exists");
} else {
  exec(`cp -r day0 ${dayName}`);
  console.log("Day created");
}

console.log("Fetching input");
exec(
  `curl https://adventofcode.com/${AOC_YEAR}/day/${dayNumber}/input --cookie session=$(cat .aocsession) > ${dayName}/input.txt`,
);
console.log("Input fetched");

exec(`open https://adventofcode.com/2023/day/${dayNumber}`);
