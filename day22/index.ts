/// <reference path="../types/globals.d.ts" />
// Note: gets trimmed
export const inputs = [
  `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`,
];

type Coordinate = {
  x: number;
  y: number;
  z: number;
};
type Range = {
  start: Coordinate;
  end: Coordinate;
};

type Brick = {
  id: number;
  range: Range;
  height: number;
  sustainedBy: Set<number>;
};

export function main() {
  const input = getInput(0);
  let maxX = 0,
    maxY = 0,
    maxZ = 0;
  const bricks: Record<number, Brick> = input
    .split("\n")
    .map((l, id) => {
      const [start, end] = l
        .split("~")
        .map((c) => c.split(","))
        .map(([x, y, z]) => ({
          x: parseInt(x),
          y: parseInt(y),
          z: parseInt(z),
        }));
      if (end.x > maxX) maxX = end.x;
      if (end.y > maxY) maxY = end.y;
      if (end.z > maxZ) maxZ = end.z;
      return {
        id,
        range: { start, end },
        height: end.z - start.z + 1,
        sustainedBy: new Set(),
      };
    })
    .reduce((bm, b) => {
      bm[b.id] = b;
      return bm;
    }, {});

  const movingSurface: {
    currBrick: number;
    currHeight: number;
  }[][] = Array(maxY + 1)
    .fill("")
    .map(() =>
      Array(maxX + 1)
        .fill("")
        .map(() => ({
          currBrick: -1,
          currHeight: 0,
        })),
    );

  for (let z = 1; z <= maxZ; z++) {
    const currBricks = bricksInSurface(Object.values(bricks), z);

    for (const bid of currBricks) {
      const cb = bricks[bid];

      let maxHeight = 0;
      for (let y = cb.range.start.y; y <= cb.range.end.y; y++) {
        for (let x = cb.range.start.x; x <= cb.range.end.x; x++) {
          maxHeight = Math.max(maxHeight, movingSurface[y][x].currHeight);
        }
      }

      for (let y = cb.range.start.y; y <= cb.range.end.y; y++) {
        for (let x = cb.range.start.x; x <= cb.range.end.x; x++) {
          const { currBrick, currHeight } = movingSurface[y][x];
          if (currBrick === bid) {
            continue;
          }

          movingSurface[y][x].currBrick = bid;
          movingSurface[y][x].currHeight = maxHeight + cb.height;

          if (currHeight === maxHeight) {
            cb.sustainedBy.add(currBrick);
          }
        }
      }
    }
  }

  let count = 0,
    bricksThatWouldFall = 0;
  for (let bid = 0; bid < Object.keys(bricks).length; bid++) {
    const fallingBricksRemovingBid = allFallingBricks(
      Object.values(bricks),
      bid,
    ).size;
    if (fallingBricksRemovingBid === 0) {
      count++;
    } else {
      bricksThatWouldFall += fallingBricksRemovingBid;
    }
  }

  sol1(count);
  sol2(bricksThatWouldFall);
}

function bricksInSurface(bricks: Brick[], z: number): number[] {
  return bricks
    .filter((b) => b.range.start.z <= z && z <= b.range.end.z)
    .map((b) => b.id);
}

function allFallingBricks(
  bricks: Brick[],
  bidToRemove: number,
  fallingBricks: Set<number> = new Set(),
): Set<number> {
  const sustainedByBid = Object.values(bricks).filter((b) =>
    b.sustainedBy.delete(bidToRemove),
  );

  const newFalling: number[] = [];
  for (const b of bricks) {
    if (b.sustainedBy.size === 0 && !fallingBricks.has(b.id)) {
      newFalling.push(b.id);
    }
  }

  for (const fb of newFalling) {
    fallingBricks.add(fb);
    allFallingBricks(bricks, fb, fallingBricks);
  }

  for (const b of sustainedByBid) {
    b.sustainedBy.add(bidToRemove);
  }

  return fallingBricks;
}

function bricksInRange(bricks: Brick[], range: Range): number[] {
  return bricks
    .filter(
      (b) =>
        rangesOverlap(
          { start: b.range.start.x, end: b.range.end.x },
          { start: range.start.x, end: range.start.x },
        ) &&
        rangesOverlap(
          { start: b.range.start.y, end: b.range.end.y },
          { start: range.start.y, end: range.start.y },
        ) &&
        rangesOverlap(
          { start: b.range.start.z, end: b.range.end.z },
          { start: range.start.z, end: range.start.z },
        ),
    )
    .map((b) => b.id);
}

function rangesOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number },
) {
  return (
    (b.start <= a.end && a.end <= b.end) ||
    (b.start <= a.start && a.start <= b.end) ||
    (a.start <= b.end && b.end <= a.end) ||
    (a.start <= b.start && b.start <= a.end)
  );
}

function splitInRangesXY(a: Range, b: Range): Range[] {
  const xRanges =
    a.start.x < b.start.x
      ? [
          [a.start.x, b.start.x],
          [b.start.x, a.end.x],
        ]
      : [
          [a.start.x, b.end.x],
          [b.end.x, a.end.x],
        ];

  const yRanges =
    a.start.y < b.start.y
      ? [
          [a.start.y, b.start.y],
          [b.start.y, a.end.y],
        ]
      : [
          [a.start.y, b.end.y],
          [b.end.y, a.end.y],
        ];

  const ranges: Range[] = [];
  for (const xr of xRanges.filter(([a, b]) => a !== b)) {
    for (const yr of yRanges.filter(([a, b]) => a !== b)) {
      ranges.push({
        start: {
          x: xr[0],
          y: yr[0],
          z: a.start.z,
        },
        end: {
          x: xr[1],
          y: yr[1],
          z: a.start.z,
        },
      });
    }
  }

  return ranges;
}
