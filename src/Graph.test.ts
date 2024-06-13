import { Graph } from "./graph";

describe("Graph", () => {
  const graph = new Graph<number>();
  /**
   *            A
   *       /    |   \
   *      B     C    D
   *     / \    |     \
   *    E   J   F      G
   */

  graph.addEdge("A", "B", 1, 1);
  graph.addEdge("A", "C", 1, 1);
  graph.addEdge("A", "D", 1, 1);
  graph.addEdge("B", "E", 1, 1);
  graph.addEdge("B", "J", 1, 1);
  graph.addEdge("C", "F", 1, 1);
  graph.addEdge("D", "G", 1, 1);

  it("bfs", () => {
    const { path, order } = graph.bfs("A", "G");
    const breadth1 = ["A"];
    const breadth2 = ["B", "C", "D"];
    const breadth3 = ["E", "J", "F", "G"];
    expect(order).toMatchObject([...breadth1, ...breadth2, ...breadth3]);
    expect(path).toMatchObject([
      { from: "A", to: "D", data: 1 },
      { from: "D", to: "G", data: 1 },
    ]);
  });

  it("dfs", () => {
    const { path, order } = graph.dfs("A", "G");
    const depth1 = ["A", "B", "E"];
    const depth2 = ["J"];
    const depth3 = ["C", "F"];
    const depth4 = ["D", "G"];
    expect(order).toMatchObject([...depth1, ...depth2, ...depth3, ...depth4]);
    expect(path).toMatchObject([
      { from: "A", to: "D", data: 1 },
      { from: "D", to: "G", data: 1 },
    ]);
  });
});

describe("Currency Graph", () => {
  const currencyGraph = new Graph<number>();
  currencyGraph.addEdge("USD", "JPY", 110, 1 / 110);
  currencyGraph.addEdge("USD", "AUD", 1.45, 1 / 1.45);
  currencyGraph.addEdge("JPY", "GBP", 0.007, 1 / 0.007);

  it("bfs", () => {
    const { path } = currencyGraph.bfs("GBP", "AUD");
    const rate = path?.reduce((acc, edge) => {
      return acc * edge.data;
    }, 1);
    expect(rate?.toFixed(2)).toBe("1.88");
  });

  it("dfs", () => {
    const { path } = currencyGraph.dfs("GBP", "AUD");
    const rate = path?.reduce((acc, edge) => {
      return acc * edge.data;
    }, 1);
    expect(rate?.toFixed(2)).toBe("1.88");
  });
});
