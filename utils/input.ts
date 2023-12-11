export function listOfNums(line: string, separator = " ") {
  return line
    .trim()
    .split(separator)
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));
}

export function toSingleNum(nums: (string | number)[]) {
  return parseInt(nums.filter((n) => !isNaN(n as number)).join(""));
}

export function toGrid(input: string[]) {
  return input.map((line) => line.split("")).filter((x) => x.length > 0);
}
