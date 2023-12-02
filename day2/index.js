const { run } = require("../shared/utils");

run(solve1, solve2);

/* CHALLENGE 1 */
function solve1(input) {
  return input.reduce((sum, line) => {
    const { gameInfo, roundsInfo } = getInfo(line);
    if (!gameInfo || !roundsInfo) return sum;

    const limits = {
      MAX_RED: 12,
      MAX_GREEN: 13,
      MAX_BLUE: 14,
    };

    return isPossible(roundsInfo.rounds, limits)
      ? sum + parseInt(gameInfo.gameID)
      : sum;
  }, 0);
}

function isPossible(rounds, limits) {
  for (const round of rounds) {
    const counts = { red: 0, blue: 0, green: 0 };
    const roundInfo = round.split(",");

    ["red", "blue", "green"].forEach((color) => {
      const colorCountInfo = roundInfo.find((info) => info.endsWith(color));
      if (!colorCountInfo) return;
      const [count] = colorCountInfo.split(color);
      counts[color] = isNaN(parseInt(count)) ? 0 : parseInt(count);
    });

    if (
      counts.red > limits.MAX_RED ||
      counts.blue > limits.MAX_BLUE ||
      counts.green > limits.MAX_GREEN
    ) {
      return false;
    }
  }

  return true;
}

/* CHALLENGE 2 */
function solve2(input) {
  return input.reduce((sum, line) => {
    const { roundsInfo } = getInfo(line);
    if (!roundsInfo) return sum;

    const minimumCounts = findMinimumCounts(roundsInfo.rounds);
    return sum + minimumCounts.red * minimumCounts.blue * minimumCounts.green;
  }, 0);
}

function findMinimumCounts(rounds) {
  const counts = { red: 0, blue: 0, green: 0 };
  for (const round of rounds) {
    const roundInfo = round.split(",");

    ["red", "blue", "green"].forEach((color) => {
      const colorCountInfo = roundInfo.find((info) => info.endsWith(color));
      if (!colorCountInfo) return;

      const [count] = colorCountInfo.split(color);
      counts[color] = Math.max(
        counts[color],
        isNaN(parseInt(count)) ? 0 : parseInt(count),
      );
    });
  }

  return counts;
}

/* SHARED */
function getInfo(line) {
  const [gameInfo, roundsInfo] = line.split(":");
  return {
    gameInfo: gameInfo && {
      gameID: gameInfo.split(" ")[1],
    },
    roundsInfo: roundsInfo && {
      rounds: roundsInfo.replace(/\s/g, "").split(";"),
    },
  };
}
