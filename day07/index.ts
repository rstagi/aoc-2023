import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  return solve(parseInput(input), { considerJokers: false });
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  return solve(parseInput(input), { considerJokers: true });
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
function parseInput(input: string[]): HandInfo[] {
  return input
    .map((line) => line.split(" "))
    .filter((line) => line.length > 1)
    .map(([hand, bid]) => [hand, parseInt(bid)]);
}

function solve(
  hands: HandInfo[],
  { considerJokers }: { considerJokers: boolean },
): number {
  const {
    fiveOfKind,
    fourOfKind,
    fullHouse,
    threeOfKind,
    twoPairs,
    onePair,
    highCard,
  } = groupByHandType(hands, { considerJokers });

  const CARD_TO_POINT = {
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

  const CARD_TO_POINT_WITH_JOKER = {
    ...CARD_TO_POINT,
    J: 1,
  };

  const scale = considerJokers ? CARD_TO_POINT_WITH_JOKER : CARD_TO_POINT;
  const sortedHandsLowestToHighest = [
    ...highCard.sort(sortByWeakestHand(scale)),
    ...onePair.sort(sortByWeakestHand(scale)),
    ...twoPairs.sort(sortByWeakestHand(scale)),
    ...threeOfKind.sort(sortByWeakestHand(scale)),
    ...fullHouse.sort(sortByWeakestHand(scale)),
    ...fourOfKind.sort(sortByWeakestHand(scale)),
    ...fiveOfKind.sort(sortByWeakestHand(scale)),
  ];

  return sortedHandsLowestToHighest.reduce((tot, [_, bid], pos) => {
    return tot + bid * (pos + 1);
  }, 0);
}

type HandInfo = [string, number];
function groupByHandType(
  hands: HandInfo[],
  { considerJokers }: { considerJokers: boolean },
) {
  const fiveOfKind: HandInfo[] = [],
    fourOfKind: HandInfo[] = [],
    fullHouse: HandInfo[] = [],
    threeOfKind: HandInfo[] = [],
    twoPairs: HandInfo[] = [],
    onePair: HandInfo[] = [],
    highCard: HandInfo[] = [];
  for (const [hand, bid] of hands) {
    const handInfo = hand.split("").reduce(
      (acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedHandInfo = Object.entries(handInfo)
      .sort((a, b) => __sorters.desc(a[1], b[1]))
      .map(([card, occurrences]) => ({ card, occurrences }));

    const bestHandInfo = considerJokers
      ? improveHandWithJoker(sortedHandInfo)
      : sortedHandInfo;

    switch (bestHandInfo[0].occurrences) {
      case 5:
        fiveOfKind.push([hand, bid]);
        break;
      case 4:
        fourOfKind.push([hand, bid]);
        break;
      case 3:
        if (bestHandInfo[1].occurrences === 2) {
          fullHouse.push([hand, bid]);
        } else {
          threeOfKind.push([hand, bid]);
        }
        break;
      case 2:
        if (bestHandInfo[1].occurrences === 2) {
          twoPairs.push([hand, bid]);
        } else {
          onePair.push([hand, bid]);
        }
        break;
      case 1:
        highCard.push([hand, bid]);
        break;
    }
  }

  return {
    fiveOfKind,
    fourOfKind,
    fullHouse,
    threeOfKind,
    twoPairs,
    onePair,
    highCard,
  };
}

function improveHandWithJoker(cards: { card: string; occurrences: number }[]) {
  const jokerIndex = cards.findIndex((card) => card.card === "J");
  if (jokerIndex !== -1) {
    const joker = cards[jokerIndex];
    if (joker.occurrences < 5) {
      cards.splice(jokerIndex, 1);
      cards[0].occurrences += joker.occurrences;
    }
  }
  return cards;
}

function sortByWeakestHand(scale: Record<string, number>) {
  return (a: HandInfo, b: HandInfo) => {
    return handsCmp(b[0], a[0], scale);
  };
}

function handsCmp(a: string, b: string, scale: Record<string, number>) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return scale[b[i]] - scale[a[i]];
    }
  }
  return 0;
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
