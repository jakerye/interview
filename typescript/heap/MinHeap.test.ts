import { MinHeap } from "./MinHeap";

describe("MinHeap", () => {
  const minHeap = new MinHeap<number>();
  /**
   *      1
   *     / \
   *    2   4
   *   /
   *  3
   */
  minHeap.insert(3);
  minHeap.insert(2);
  minHeap.insert(1);
  minHeap.insert(4);

  it("basic", () => {
    console.log(minHeap.toArray());
    // expect(minHeap.toArray()).toBe([1, 2, 3, 4]);
  });
});
