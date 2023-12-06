export function listOfNums(line: string, separator = " ") {
  return line
    .trim()
    .split(separator)
    .map((n) => parseInt(n))
    .filter((n) => !isNaN(n));
}

export function toSingleNum(nums: (string | number)[]) {
  return parseInt(nums.join(""));
}
