export function insertAt<T>(arr: T[], index: number, value: T) {
  arr.splice(index, 0, value);
}

export function insertManyAt<T>(arr: T[], index: number, values: T[]) {
  arr.splice(index, 0, ...values);
}

export function insertSorted<T>(
  arr: T[],
  value: T,
  compare: (a: T, b: T) => number,
) {
  const index = arr.findIndex((x) => compare(x, value) > 0);
  if (index === -1) {
    arr.push(value);
  } else {
    insertAt(arr, index, value);
  }
}

export function makePairs<T>(src: T[]): [T, T][] {
  const pairs = [];
  for (let i = 0; i < src.length; i++) {
    for (let j = i + 1; j < src.length; j++) {
      pairs.push([src[i], src[j]]);
    }
  }
  return pairs;
}

export function distinct<T>(resources: T[]): T[] {
  return [...new Set(resources)];
}

export function distinctProp<T, K extends keyof T>(
  resources: T[],
  key: K,
): Exclude<T[K], null | undefined>[] {
  return [
    ...new Set(
      resources
        .filter((item) => Boolean(item[key]))
        .map((item) => item[key] as Exclude<T[K], null | undefined>),
    ),
  ];
}
