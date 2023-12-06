import fs from "fs";
import { max } from "./utils/reducers";
import { exec } from "child_process";

const AOC_YEAR = 2023;

const day = process.argv[2] ?? getNextDayFromDir();

console.log("Inintializing day", day);
if (fs.existsSync(`./day${day}`)) {
  console.log("Day already exists");
} else {
  exec(`cp -r day0 day${day}`);
  console.log("Day created");
}

console.log("Fetching input");
exec(
  `curl https://adventofcode.com/${AOC_YEAR}/day/${day}/input --cookie session=$(cat .aocsession) > day${day}/input.txt`,
);
console.log("Input fetched");

function getNextDayFromDir() {
  return (
    fs
      .readdirSync("./")
      .filter((f) => f.startsWith("day"))
      .map((f) => parseInt(f.replace("day", "")))
      .reduce(...max) + 1
  ).toString();
}
