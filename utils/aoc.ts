import fs from "fs";

export function getLastDayFromDir() {
  return fs
    .readdirSync("./")
    .filter((f) => f.startsWith("day"))
    .map((f) => parseInt(f.replace("day", "")))
    .reduce((max, cur) => Math.max(max, cur), 0);
}

export function formatDay(day: number) {
  return `day${day.toString().padStart(2, "0")}`;
}
