import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
type HandInfo = [string, number];

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const parsedInput = parseInput(input);
  // console.log(parsedInput);

  const five: HandInfo[] = [],
    four: HandInfo[] = [],
    fullHouse: HandInfo[] = [],
    three: HandInfo[] = [],
    two: HandInfo[] = [],
    one: HandInfo[] = [],
    highCard: HandInfo[] = [];
  for (const [hand, _bid] of parsedInput) {
    const bid = parseInt(_bid);
    const handInfo = hand.split("").reduce(
      (acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedPairs = Object.entries(handInfo).sort((a, b) => b[1] - a[1]);
    // console.log(sortedPairs);

    switch (sortedPairs[0][1]) {
      case 5:
        five.push([hand, bid]);
        break;
      case 4:
        four.push([hand, bid]);
        break;
      case 3:
        if (sortedPairs[1][1] === 2) {
          fullHouse.push([hand, bid]);
        } else {
          three.push([hand, bid]);
        }
        break;
      case 2:
        if (sortedPairs[1][1] === 2) {
          two.push([hand, bid]);
        } else {
          one.push([hand, bid]);
        }
        break;
      case 1:
        highCard.push([hand, bid]);
        break;
    }
  }

  // console.log(five, four, fullHouse, three, two, one, highCard);

  five.sort((a, b) => compareHands(a[0], b[0]));
  four.sort((a, b) => compareHands(a[0], b[0]));
  fullHouse.sort((a, b) => compareHands(a[0], b[0]));
  three.sort((a, b) => compareHands(a[0], b[0]));
  two.sort((a, b) => compareHands(a[0], b[0]));
  one.sort((a, b) => compareHands(a[0], b[0]));
  highCard.sort((a, b) => compareHands(a[0], b[0]));

  // console.log(five, four, fullHouse, three, two, one, highCard);

  console.log(
    [
      ["5872T", 522],
      ["95J8T", 666],
      ["6Q8T7", 944],
    ].sort((a, b) => compareHands(a[0] as string, b[0] as string)),
  );

  let total = 0,
    pos = parsedInput.length;
  console.log(pos);
  for (const hand of five) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of four) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of fullHouse) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of three) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of two) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of one) {
    total += hand[1] * pos;
    pos -= 1;
  }
  for (const hand of highCard) {
    total += hand[1] * pos;
    pos -= 1;
  }

  console.log(pos);
  return total;
}

const scale = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};
function compareHands(a: string, b: string) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return scale[b[i]] - scale[a[i]];
    }
  }
  return 0;
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  // console.log(parsedInput);
  const {} = parseInput;

  return 42;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]) {
  return input.map((line) => line.split(" ")).filter((line) => line.length > 1);
}

export const __forceInput = {
  // force: true,
  input: `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim(),
};
