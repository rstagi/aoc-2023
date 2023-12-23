export class OSet<T extends Record<string, unknown>> {
  private set: Set<string>;

  constructor(startingElements: T[] = []) {
    this.set = new Set<string>();
    this.add(...startingElements);
  }

  private _encode(el: T): string {
    return JSON.stringify(el, Object.keys(el).sort());
  }

  private _decode(str: string): T {
    return JSON.parse(str);
  }

  add(...elements: T[]) {
    elements.map(this._encode).forEach((s) => this.set.add(s));
  }

  values(): T[] {
    return [...this.set].map(this._decode);
  }

  has(el: T): boolean {
    return this.set.has(this._encode(el));
  }

  delete(el: T): boolean {
    return this.set.delete(this._encode(el));
  }

  size(): number {
    return this.set.size;
  }

  clear(): void {
    this.set.clear();
  }

  forEach(cb: (value: T) => void): void {
    this.set.forEach((str) => cb(this._decode(str)));
  }
}
