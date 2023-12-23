export const inputs = [
  `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`,
];

export function main() {
  const input = getInput(0).split("\n");

  sol1(
    input.reduce((sum, line) => {
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
    }, 0),
  );

  sol2(
    input.reduce((sum, line) => {
      const { roundsInfo } = getInfo(line);
      if (!roundsInfo) return sum;

      const minimumCounts = findMinimumCounts(roundsInfo.rounds);
      return sum + minimumCounts.red * minimumCounts.blue * minimumCounts.green;
    }, 0),
  );
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
