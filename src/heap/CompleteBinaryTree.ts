/**
 * Complete binary trees have fully populated levels -- with the exception of the bottom most level
 * which is filled from left to right.
 *
 * These can be stored in a single array where children are located at:
 *    LEFT: 2i + 1
 *    RIGHT: 2i + 2
 *
 * And parents are located at:
 *    (i-1) / 2
 */

export class CompleteBinaryTree<T> {
  protected nodes: T[] = [];
  protected size = 0;

  public insert(value: T): void {
    this.nodes.push(value);
    this.size++;
  }

  public toArray(): T[] {
    return this.traverse(0);
  }

  protected getLeftChild(parentIndex: number): T | null {
    return this.nodes[this.getLeftChildIndex(parentIndex)] ?? null;
  }

  protected getRightChild(parentIndex: number): T | null {
    return this.nodes[this.getRightChildIndex(parentIndex)] ?? null;
  }

  protected getParent(childIndex: number): T | null {
    return this.nodes[this.getParentIndex(childIndex)] ?? null;
  }

  protected getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }

  protected getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  protected getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }
  protected isValidIndex(index: number): boolean {
    return index >= 0 && index < this.size;
  }

  protected swap(index1: number, index2: number): void {
    [this.nodes[index1], this.nodes[index2]] = [
      this.nodes[index2],
      this.nodes[index1],
    ];
  }

  protected traverse(index: number, result: T[] = []): T[] {
    if (!this.isValidIndex(index)) return result;

    result.push(this.nodes[index]); // Pre-order: root, left, right
    this.traverse(this.getLeftChildIndex(index), result);
    this.traverse(this.getRightChildIndex(index), result);

    return result;
  }
}
