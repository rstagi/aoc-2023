import { mul } from "../utils/reducers";

/* CHALLENGE 1 */
function solve1(input: string[]) {
  const { times, distances } = readInput(input);

  const totWays = [];
  for (let i = 0; i < times.length; ++i) {
    totWays.push(calcTotalWays(times[i], distances[i]));
  }

  return totWays.reduce(...mul);
}

/* CHALLENGE 2 */
function solve2(input: string[]) {
  const { times, distances } = readInput(input);

  let ways = calcTotalWays(
    parseInt(times.join("")),
    parseInt(distances.join("")),
  );

  return ways;
}

/* SHARED */
function readInput(input: string[]) {
  return {
    times: input[0]
      .split(": ")[1]
      .trim()
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n)),
    distances: input[1]
      .split(": ")[1]
      .trim()
      .split(" ")
      .map((n) => parseInt(n))
      .filter((n) => !isNaN(n)),
  };
}

function calcTotalWays(timeAvailable: number, distance: number) {
  let ways = 0;
  for (let pressFor = 1; pressFor < timeAvailable; ++pressFor) {
    // pressFor = velocity in mm/ms
    // timeAvailable - pressFor = remaining time in ms
    // pressFor * (timeAvailable - pressFor) = distance in mm
    if (pressFor * (timeAvailable - pressFor) > distance) {
      ways += 1;
    }
  }
  return ways;
}

module.exports = { solve1, solve2 };
