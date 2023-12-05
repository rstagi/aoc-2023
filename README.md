# Advent Of Code 2023

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

By default, it will execute the `index.js` with the `input.txt` file inside the `dayN` folder.

You can customize the input file by passing an additional argument:
```sh
npm start dayN ./dayN/some_other_input.txt
```

## Write new solutions

To kick-off a new day, simply  run:
```sh
npm run newday
```
