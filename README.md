# aoc-2023

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

You can customize the input file by using the `--input` parameter:
```sh
npm start dayN --input=./dayN/some_other_input.txt
```

## Write new solutions

To write new solutions, you can add a new folder in the repository root and place inside of it an `index.js` and an `input.txt` files.

```
.
├── dayN
│   ├── index.js
│   └── input.txt
```

The `index.js` file should return two functions `solve1` and `solve2`, which receives an input array of lines read by the input file, and returns the solution for the given challenge.

For example, let's assume you have the following solution file inside `dayN/index.js`:
```js
module.exports = {
  // add all numbers
  solve1: (input) => input.reduce((sum, line) => sum + parseInt(line), 0),
  // multiply all numbers
  solve2: (input) => input.reduce((sum, line) => sum * parseInt(line), 1),
}
```

Given the following input file `dayN/input.txt`:
```
1
2
3
4
5
```

The output result will be:
```sh
$ npm start dayN

> aoc-2023@1.0.0 start
> node run.js dayN

solve1 result:  15 
solve2 result:  120
```

To kick-off a new day, you can simply copy and paste the folder `day0` to a new folder `dayN` and start modifying the `solve1` and `solve2` fuctions.
