# Advent Of Code 2023

## Start a day
To run one of the solutions, run the following command:
```sh
npm start dayN
```

The output will be something like the following:
```sh
$ npm start dayN

> aoc-2023@1.0.0 start
> node run.js day0

solve1 result:  42
solve2 result:  42
```

## Init a new day

Run:
```sh
npm run newday
```

This will init the next day considering the current directories (e.g. if the last `dayN` directory is `day12`, this command will init `day13`).

To init a specific day, run:
```sh
npm run newday N 
```
Where N is between 1 and 25.

## AoC session

The `newday` script will search for a `.aocsession` file in the root of the project, which should contain the AoC session token ([see here how to retrieve the token](https://github.com/wimglenn/advent-of-code-wim/issues/1)).
Be aware that you need to take ONLY the token, not the entire cookie. So the `.aocsession` file should contain something like the following:
```
53616c...795fa23
```

without the leading `session=`.
