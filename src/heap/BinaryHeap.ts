import { CompleteBinaryTree } from "./CompleteBinaryTree";

type Comparator<T> = (a: T, b: T) => number;

/**
 * Represents a binary heap data structure.
 * Allows insertion and extraction of elements while maintaining heap properties
 * based on a provided comparator function.
 */
export class BinaryHeap<T> extends CompleteBinaryTree<T> {
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    super();
    this.comparator = comparator;
  }

  public insert(value: T): void {
    this.nodes.push(value);
    this.size++;
    this.heapifyUp(this.size - 1);
  }

  public extractRoot(): T | null {
    if (this.size === 0) return null;

    const root = this.nodes[0];
    this.nodes[0] = this.nodes[this.size - 1];
    this.nodes.pop();
    this.size--;

    if (this.size > 0) {
      this.heapifyDown(0);
    }

    return root;
  }

  /**
   * Restores the heap property upwards from a given index.
   */
  protected heapifyUp(index: number): void {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      if (
        this.comparator(this.nodes[currentIndex], this.nodes[parentIndex]) < 0
      ) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * Restores the heap property downwards from a given index.
   */
  protected heapifyDown(index: number): void {
    let currentIndex = index;
    while (currentIndex < this.size) {
      const leftChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);
      let selectedIndex = currentIndex;

      if (
        leftChildIndex < this.size &&
        this.comparator(this.nodes[leftChildIndex], this.nodes[selectedIndex]) <
          0
      ) {
        selectedIndex = leftChildIndex;
      }
      if (
        rightChildIndex < this.size &&
        this.comparator(
          this.nodes[rightChildIndex],
          this.nodes[selectedIndex]
        ) < 0
      ) {
        selectedIndex = rightChildIndex;
      }

      if (selectedIndex !== currentIndex) {
        this.swap(currentIndex, selectedIndex);
        currentIndex = selectedIndex;
      } else {
        break;
      }
    }
  }
}
