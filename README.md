# Advent Of Code 2023

## Run the solutions for a specific day

To run the solution for the **last day**, simply run:
```sh
npm start
```

You can optionally run the solution for some other day by specificying it as argument. For example, to run the solutions for day 1, you can run:
```sh
npm start day01
```

## Structure of the solutions
The solutions follow the following template:
```ts
const inputs = [
`
some-input
`
]

export function main() {
    const myInput = getInput(0);

    // ... solve part 1 and calculate mySol1 ...
    sol1(mySol1);

    // ... solve part 2 and calculate mySol2 ...
    sol2(mySol2);
}
```

The utilities behave as follows:
- `getInput`: when running in "custom input" mode, returns the element inside the `inputs` array corresponding to the parameter; when running in "problem input" mode, it always returns the problem input (i.e.: the input contained in the `input.txt` file in the same folder).
- `sol1` and `sol2`: give the answer for the part 1 and part 2 of the problem respectively.

By default, the `main` function is called twice: once in "custom input" mode and once in "problem input" mode. If you'd like to run just one of the two, you can do so as follows:
```sh
npm start --custom-only # runs only with custom input
npm start --problem-only # runs only with problem input
```


## Init a new day

Run:
```sh
npm run newday
```

This will init the next day considering the current directories (e.g. if the last `dayN` directory is `day12`, this command will init `day13`).

To init a specific day (for example day 25), run:
```sh
npm run newday 25 
```

### AoC session

The `newday` script will search for a `.aocsession` file in the root of the project, which should contain the AoC session token ([see here how to retrieve the token](https://github.com/wimglenn/advent-of-code-wim/issues/1)).
Be aware that you need to take ONLY the token, not the entire cookie. So the `.aocsession` file should contain something like the following:
```
53616c...795fa23
```

without the leading `session=`.

## Aliases

To help with all the scripts above, you can use the provided aliases inside `aliases.sh`, by simply running:
```sh
source aliases.sh
```

This will provide you with:
- `aoc` to run the last solution
- `aocc` to run the last solution in `--custom-only` mode
- `aocp` to run the last solution in `--problem-only` mode
- `aocn` to init the new day

Note that `aoc` and `aocn` are simple aliases of `npm start` and `npm run newday`, so you can also pass their respective arguments if you'd like to do so.
