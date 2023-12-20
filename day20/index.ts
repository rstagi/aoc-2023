import * as __input from "../utils/input";
import * as __reducers from "../utils/reducers";
import * as __sorters from "../utils/sorters";
import * as __math from "../utils/math";
import * as __arrays from "../utils/arrays";
import * as __grids from "../utils/grids";

const toggle = {
  off: "on",
  on: "off",
} as const;

/* CHALLENGE 1 */
export function solve1(input: string[]) {
  const modules = parseInput(input);
  console.log(modules);
  // return;

  let highPulses = 0,
    lowPulses = 0;
  for (let pushes = 0; pushes < 1000; pushes++) {
    const signals: { type: "high" | "low"; from: string; to: string }[] = [];
    signals.push({ type: "low", from: "button", to: "broadcaster" });
    while (signals.length > 0) {
      let signal = signals.shift()!;
      console.log("Received signal:", signal);

      if (signal.type === "high") {
        highPulses++;
      } else {
        lowPulses++;
      }

      let currModule = modules[signal.to];
      if (!currModule) {
        console.log("NOT FOUND", signal.to);
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
          signals.push(
            ...currModule.to.map(
              (t) =>
                ({ from: currModule.from, type: inputState, to: t }) as const,
            ),
          );
      }
    }
    // break;
  }

  console.log("");
  console.log(highPulses, lowPulses, highPulses * lowPulses);
  return highPulses * lowPulses;
}

/* CHALLENGE 2 */
export function solve2(input: string[]) {
  const parsedInput = parseInput(input);
  // console.log(parsedInput);
  const {} = parsedInput;

  return 42;
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
};

type Conjuction = {
  type: "&";
  from: string;
  to: string[];
  inputs: {
    [m: string]: "high" | "low";
  };
};

type Module = Broadcaster | FlipFlop | Conjuction;

function parseInput(input: string[]) {
  const mods = input
    .map((r) => r.split(" -> "))
    .filter((l) => l.length > 1)
    .map(([from, to]) => {
      console.log("From: ", from, "To: ", to);
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
          (mods[t] as Conjuction).inputs[m.from] = "low";
        }
      }
    }
  }
  return mods;
}

export const __forceInput = {
  // force: true,
  input: `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`.trim(),
};
