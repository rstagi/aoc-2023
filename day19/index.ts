import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

export const inputs = [
  `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`,
];

export function main() {
  // Part 1
  const { rules, workflows } = parseInput(getInput(0).split("\n"));

  let sum = 0;
  for (const workflow of workflows) {
    const { x, m, a, s } = workflow;
    let currRule = "in";
    while (currRule !== "R" && currRule !== "A") {
      let found = false;
      for (const rule of rules[currRule].conditions) {
        if (eval(`${rule.variable} ${rule.condition}`)) {
          currRule = rule.destination;
          found = true;
          break;
        }
      }
      if (!found) {
        currRule = rules[currRule].fallback;
      }
    }
    if (currRule === "A") {
      sum += x + m + a + s;
    }
  }

  sol1(sum);

  // Part 2
  const rangesToA: Record<Variable, { min: number; max: number }> = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };

  const ranges: Ranges[] = [];
  findRanges("in", rangesToA, ranges, rules);

  let combinations = 0;
  for (const range of ranges) {
    combinations +=
      (range.x.max - range.x.min + 1) *
      (range.m.max - range.m.min + 1) *
      (range.a.max - range.a.min + 1) *
      (range.s.max - range.s.min + 1);
  }

  sol2(combinations);
}

type Ranges = Record<Variable, { min: number; max: number }>;
function findRanges(
  currRule: string,
  ranges: Ranges,
  possibleRanges: Ranges[],
  rules: Record<string, Rule>,
) {
  if (currRule === "A") {
    possibleRanges.push(ranges);
    return;
  }

  if (currRule === "R") {
    return;
  }

  ranges = structuredClone(ranges);
  for (const cond of rules[currRule].conditions) {
    const { variable, condition, destination } = cond;
    const newRanges = {
      ...ranges,
      [variable]: {
        min: condition.includes(">")
          ? Math.max(
              ranges[variable].min,
              parseInt(condition.split(">")[1]) + 1,
            )
          : ranges[variable].min,
        max: condition.includes("<")
          ? Math.min(
              ranges[variable].max,
              parseInt(condition.split("<")[1]) - 1,
            )
          : ranges[variable].max,
      },
    };
    if (ranges[variable].min <= ranges[variable].max) {
      findRanges(destination, newRanges, possibleRanges, rules);
    }

    ranges = {
      ...structuredClone(ranges),
      [variable]: {
        min: condition.includes("<")
          ? Math.max(ranges[variable].min, parseInt(condition.split("<")[1]))
          : ranges[variable].min,
        max: condition.includes(">")
          ? Math.min(ranges[variable].max, parseInt(condition.split(">")[1]))
          : ranges[variable].max,
      },
    };

    if (ranges[variable].min > ranges[variable].max) {
      return;
    }
  }

  findRanges(rules[currRule].fallback, ranges, possibleRanges, rules);
}

/* SHARED */
type Variable = "x" | "m" | "a" | "s";
type Rule = {
  name: string;
  conditions: {
    variable: Variable;
    condition: string;
    destination: string;
  }[];
  fallback: string;
};

function parseInput(input: string[]) {
  const rules: Record<string, Rule> = {};
  for (let i = 0; i < input.length; i++) {
    if (input[i].trim() === "") {
      break;
    }
    const [name, _rules] = input[i].split("{");
    const rulesInfo = _rules.split(",");
    const fallback = rulesInfo.pop()!.split("}")[0];
    const conditions = rulesInfo.map((rule) => {
      const [cond, destination] = rule.split(":");
      return {
        variable: cond[0] as Variable,
        condition: cond.slice(1),
        destination,
      };
    });
    rules[name] = { name, conditions, fallback };
  }

  const workflows = input.slice(input.indexOf("") + 1).map((line) => {
    const values = line.replace("{", "").replace("}", "").split(",");
    const workflow: Record<"x" | "m" | "a" | "s", number> = values.reduce(
      (w, v) => {
        w[v[0]] = parseInt(v.split("=")[1]);
        return w;
      },
      {} as any,
    );
    return workflow;
  });

  return { rules, workflows };
}
