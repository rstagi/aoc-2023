/// <reference path="../types/globals.d.ts" />
// Note: gets trimmed
export const inputs = [
  `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`,
];

import { OSet } from "../utils/set";

export function main() {
  const input = getInput(0);
  const grid = input.split("\n").map((l) => l.split(""));
  sol1(findMaxPath(grid, { isSlippery: true }));
  sol2(findMaxPath(grid, { isSlippery: false }));
}

function findMaxPath(_grid: string[][], opts: { isSlippery: boolean }) {
  const grid = _grid.map((r) =>
    r.map((c) =>
      !opts.isSlippery && ["^", "v", "<", ">"].includes(c) ? "." : c,
    ),
  );

  const startTile = { r: 0, c: grid[0].findIndex((c) => c === ".") };
  const endTile = {
    r: grid.length - 1,
    c: grid[grid.length - 1].findIndex((c) => c === "."),
  };

  const nodes = getNodes();

  const visitedNode = Object.keys(nodes).reduce(
    (visitedMap, nodeId) => {
      visitedMap[nodeId] = false;
      return visitedMap;
    },
    {} as Record<string, boolean>,
  );

  const [startTileNodeId] = Object.entries(nodes).find(([, { tile }]) =>
    util.isDeepStrictEqual(tile, startTile),
  )!;

  return _findMaxPath(startTileNodeId, "0", 0);

  function _findMaxPath(currNode: string, endNode: string, currLen: number) {
    if (currNode === endNode) {
      return currLen;
    }

    visitedNode[currNode] = true;
    let maxPath = 0;
    for (const [nextNode, dist] of Object.entries(
      nodes[currNode].connectedNodes,
    ).filter(([nodeId]) => !visitedNode[nodeId])) {
      const subMaxPath = _findMaxPath(nextNode, endNode, currLen + dist);
      if (subMaxPath > maxPath) {
        maxPath = subMaxPath;
      }
    }

    visitedNode[currNode] = false;
    return maxPath;
  }

  function getNodes() {
    type Node = {
      tile: { r: number; c: number };
      connectedNodes: Record<number, number>;
    };
    const nodes: Record<string, Node> = {
      "0": {
        tile: endTile,
        connectedNodes: {},
      },
    };

    const queue = [{ fromNodeId: "0", currTile: endTile, dist: 0 }];
    const visited = new OSet([{ ...endTile, fromNodeId: "0" }]);
    while (queue.length > 0) {
      const { fromNodeId, currTile, dist } = queue.shift()!;

      const nextTiles = getNextTiles(currTile).filter(
        (t) => !visited.has({ ...t, fromNodeId }),
      );

      const isNode =
        nextTiles.length > 1 || util.isDeepStrictEqual(currTile, startTile);

      let nodeId = fromNodeId,
        newDist = dist;
      if (isNode) {
        const nodeEntry = Object.entries(nodes).find(([_, n]) =>
          util.isDeepStrictEqual(n.tile, currTile),
        );

        if (nodeEntry !== undefined) {
          const [id] = nodeEntry;
          nodes[id].connectedNodes[fromNodeId] = dist;
          nodeId = id;
        } else {
          const newNodeId = `${Object.keys(nodes).length}`;
          nodes[newNodeId] = {
            tile: currTile,
            connectedNodes: {
              [fromNodeId]: dist,
            },
          };
          nodeId = newNodeId;
        }

        visited.add({ ...currTile, fromNodeId: nodeId });

        newDist = 0;
      }

      visited.add(...nextTiles.map((t) => ({ ...t, fromNodeId: nodeId })));
      queue.push(
        ...nextTiles.map((t) => ({
          fromNodeId: nodeId,
          currTile: t,
          dist: newDist + 1,
        })),
      );
    }
    return nodes;
  }

  function getNextTiles(currTile: { r: number; c: number }) {
    const { r, c } = currTile;

    const deltas = (
      {
        "^": [[+1, 0]],
        ">": [[0, -1]],
        v: [[-1, 0]],
        "<": [[0, +1]],
        ".": [
          [-1, 0],
          [0, -1],
          [0, +1],
          [+1, 0],
        ],
      } as const
    )[grid[r][c]]!;

    return deltas
      .filter(([deltaR, deltaC]) => {
        const newR = r + deltaR;
        const newC = c + deltaC;
        if (
          newR < 0 ||
          newC < 0 ||
          newR >= grid.length ||
          newC >= grid[0].length ||
          grid[newR][newC] === "#"
        ) {
          return false;
        }

        return (
          grid[newR][newC] === "." ||
          (newR != r && ["^", "v"].includes(grid[newR][newC])) ||
          (newC != c && ["<", ">"].includes(grid[newR][newC]))
        );
      })
      .map(([deltaR, deltaC]) => ({ r: r + deltaR, c: c + deltaC }));
  }
}
