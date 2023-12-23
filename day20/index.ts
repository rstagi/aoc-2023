import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

export const inputs = [
  `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`,
];

const toggle = {
  off: "on",
  on: "off",
} as const;

export function main() {
  const input = getInput(0).split("\n");
  const modules = parseInput(input);

  // WARN: It doesn't work with the custom solution above, it needs to be refactored (sorry)

  let highPulses = 0,
    lowPulses = 0;
  for (let pushes = 1; pushes < Infinity; pushes++) {
    const signals: { type: "high" | "low"; from: string; to: string }[] = [];
    signals.push({ type: "low", from: "button", to: "broadcaster" });
    const rxPressed = [];
    while (signals.length > 0) {
      let signal = signals.shift()!;

      if (signal.type === "high") {
        highPulses++;
      } else {
        lowPulses++;
      }

      if (signal.to === "rx") {
        rxPressed.push(signal.type);
      }

      let currModule = modules[signal.to];
      if (!currModule) {
        continue;
      }

      switch (currModule.type) {
        case "broadcaster":
          signals.push(
            ...currModule.to.map((t) => ({
              from: currModule.from,
              to: t,
              type: signal.type,
            })),
          );
          break;

        case "%":
          const newState =
            signal.type === "low" ? toggle[currModule.state] : currModule.state;
          if (currModule.state === "off" && newState === "on") {
            currModule.cycleLength =
              currModule.cycleLength < 0 ? pushes : currModule.cycleLength;
            signals.push(
              ...currModule.to.map(
                (t) =>
                  ({ from: currModule.from, type: "high", to: t }) as const,
              ),
            );
          } else if (currModule.state === "on" && newState === "off") {
            signals.push(
              ...currModule.to.map(
                (t) => ({ from: currModule.from, type: "low", to: t }) as const,
              ),
            );
          }
          currModule.state = newState;
          break;
        case "&":
          currModule.inputs[signal.from] = signal.type;
          const inputState = Object.values(currModule.inputs).every(
            (s) => s === "high",
          )
            ? "low"
            : "high";

          if (inputState === "high" && currModule.cycleLength < 0) {
            currModule.cycleLength = pushes;
          }
          signals.push(
            ...currModule.to.map(
              (t) =>
                ({ from: currModule.from, type: inputState, to: t }) as const,
            ),
          );
      }
    }
    if (
      Object.values(modules)
        .filter((m) => m.type === "&" && m.from !== "dd")
        .every((m: Conjunction) => m.cycleLength > 0)
    ) {
      break;
    }
    if (rxPressed.includes("low")) {
      return pushes;
    }
    if (rxPressed.length === 1 && rxPressed[0] === "low") {
      return pushes;
    }
  }
  printModules("dd", modules);
  const ddMod = modules["dd"] as Conjunction;
  const cycleLengths = Object.keys(ddMod.inputs).map(
    (m) => (modules[m] as FlipFlop | Conjunction).cycleLength,
  );
  const cycleLength = cycleLengths.reduce(...__reducers.lcm);
  console.log(cycleLengths, cycleLength);

  sol2(highPulses * lowPulses);
}

const printed = new Set<string>();
function printModules(module: string, modules: Record<string, Module>) {
  const curr = modules[module];
  if (!curr || printed.has(module)) {
    return;
  }

  console.log(curr);
  printed.add(module);

  const toThis = Object.values(modules).filter((m) =>
    m.to.includes(module),
  ) as Module[];

  for (const m of toThis) {
    printModules(m.from, modules);
  }
}

function calcCycleLength(conj: Conjunction, modules: Record<string, Module>) {
  if (conj.cycleLength > 0) {
    return conj.cycleLength;
  }

  if (
    Object.keys(conj.inputs).every(
      (m) => (modules[m] as FlipFlop | Conjunction).cycleLength > 0,
    )
  ) {
    conj.cycleLength = Object.keys(conj.inputs)
      .map((m) => (modules[m] as FlipFlop | Conjunction).cycleLength)
      .reduce(...__reducers.lcm);
    return conj.cycleLength;
  }

  for (const m of Object.keys(conj.inputs)) {
    if (
      modules[m].type === "&" &&
      (modules[m] as Conjunction).cycleLength < 0
    ) {
      calcCycleLength(modules[m] as Conjunction, modules);
    }
  }

  conj.cycleLength = Object.keys(conj.inputs)
    .map((m) => (modules[m] as FlipFlop | Conjunction).cycleLength)
    .reduce(...__reducers.lcm);
  return conj.cycleLength;
}

/* SHARED */
// Parse the input into a usable format. An example of input is provided below in the __forceInput.input variable.
type Broadcaster = {
  type: "broadcaster";
  from: "broadcaster";
  to: string[];
  state: "";
};

type FlipFlop = {
  type: "%";
  from: string;
  to: string[];
  state: "on" | "off";
  cycleLength: number;
};

type Conjunction = {
  type: "&";
  from: string;
  to: string[];
  inputs: {
    [m: string]: "high" | "low";
  };
  cycleLength: number;
};

type Module = Broadcaster | FlipFlop | Conjunction;

function parseInput(input: string[]) {
  const mods = input
    .map((r) => r.split(" -> "))
    .filter((l) => l.length > 1)
    .map(([from, to]) => {
      return {
        from,
        to: to.split(", "),
      };
    })
    .map(({ from, to }) => ({
      type: from === "broadcaster" ? from : from[0],
      from: from === "broadcaster" ? from : from.slice(1),
      to,
      state: from[0] === "%" ? "off" : "",
      inputs: from[0] === "&" ? [] : undefined,
      cycleLength: -1,
    }))
    .reduce(
      (acc, module) => ({
        ...acc,
        [module.from]: module as Module,
      }),
      {} as Record<string, Module>,
    );
  for (const m of Object.values(mods)) {
    if (m.type === "%") {
      for (const t of m.to) {
        if (mods[t].type === "&") {
          (mods[t] as Conjunction).inputs[m.from] = "low";
        }
      }
    }
  }
  return mods;
}
