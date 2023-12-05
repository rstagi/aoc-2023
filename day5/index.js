function solve1(input) {
  const seeds = input[0]
    .split(": ")[1]
    .split(" ")
    .map((n) => parseInt(n));

  return solve(
    input.slice(1),
    seeds.map((s) => [s, s + 1]),
  );
}

/* CHALLENGE 2 */
function solve2(input) {
  const seedsRangesInfo = input[0]
    .split(": ")[1]
    .split(" ")
    .map((n) => parseInt(n));

  const seedsRanges = [];
  for (let i = 0; i < seedsRangesInfo.length; i += 2) {
    const from = seedsRangesInfo[i];
    const to = from + seedsRangesInfo[i + 1];
    seedsRanges.push([from, to]);
  }

  return solve(input.slice(1), seedsRanges);
}

function solve(input, seedsRanges) {
  const elements = {};
  elements["seed"] = seedsRanges;

  let currFrom, currTo;
  for (const line of input) {
    if (line === "") {
      continue;
    }

    if (line.includes("map:")) {
      if (currFrom && currTo) elements[currTo].push(...elements[currFrom]);
      const [from, to] = line.split(" ")[0].split("-to-");
      currFrom = from;
      currTo = to;
      elements[currTo] = [];
      continue;
    }

    const [dest_start, src_start, range_length] = line
      .split(" ")
      .map((n) => parseInt(n));

    const isIncluded = ([el_start, el_end]) =>
      isInRange([el_start, el_end], src_start) ||
      isInRange([el_start, el_end], src_start + range_length - 1) ||
      isInRange([src_start, src_start + range_length], el_start) ||
      isInRange([src_start, src_start + range_length], el_end - 1);

    const includedSrcElements = elements[currFrom].filter((r) => isIncluded(r));

    elements[currFrom] = elements[currFrom].filter((r) => !isIncluded(r));

    elements[currTo].push(
      ...includedSrcElements
        .map(([el_start, el_end]) => {
          const start = Math.max(el_start, src_start);
          const end = Math.min(el_end, src_start + range_length);
          return [start, end];
        })
        .map((r) => [
          dest_start + r[0] - src_start,
          dest_start + r[1] - src_start,
        ]),
    );

    elements[currFrom].push(
      ...includedSrcElements.flatMap(([el_start, el_end]) =>
        [
          [Math.min(el_start, src_start), src_start],
          [
            src_start + range_length,
            Math.max(el_end, src_start + range_length),
          ],
        ].filter(([from, to]) => from < to),
      ),
    );
  }
  if (currFrom && currTo) elements[currTo].push(...elements[currFrom]);

  return elements[currTo].reduce((min, [e]) => Math.min(min, e), Infinity);
}

function isInRange([from, to], n) {
  return n >= from && n < to;
}

module.exports = { solve1, solve2 };
