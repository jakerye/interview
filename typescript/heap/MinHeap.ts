import { BinaryHeap } from "./BinaryHeap";

/**
 * Represents a minimum binary heap data structure.
 */
export class MinHeap<T> extends BinaryHeap<T> {
  constructor() {
    super((a: T, b: T) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }
}
