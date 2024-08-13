import { BinaryHeap } from "./BinaryHeap";

/**
 * Represents a maximum binary heap data structure.
 */
export class MaxHeap<T> extends BinaryHeap<T> {
  constructor() {
    super((a: T, b: T) => {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    });
  }
}
