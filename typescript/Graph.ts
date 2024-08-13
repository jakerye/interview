export type Neighbor<D> = { vertex: string; data: D };

export type Routes<D> = Map<string, { previous: string; data: D }>;

export type Path<D> = Array<{ from: string; to: string; data: D }>;

export class Graph<D> {
  private adjacencyList: Map<string, Neighbor<D>[]> = new Map();

  public addEdge(vertex1: string, vertex2: string, data12: D, data21: D) {
    if (!this.adjacencyList.has(vertex1)) this.adjacencyList.set(vertex1, []);
    this.adjacencyList.get(vertex1)?.push({ vertex: vertex2, data: data12 });
    if (!this.adjacencyList.has(vertex2)) this.adjacencyList.set(vertex2, []);
    this.adjacencyList.get(vertex2)?.push({ vertex: vertex1, data: data21 });
  }

  public bfs(
    from: string,
    to: string
  ): { path: Path<D> | null; order: string[] } {
    if (from === to) {
      return { path: [{ from, to, data: {} as D }], order: [from] };
    }

    const queue: string[] = [from];
    const visited: Set<string> = new Set([from]);
    const routes: Routes<D> = new Map();
    const order: string[] = [from];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = this.adjacencyList.get(current) ?? [];

      for (const neighbor of neighbors) {
        // Check visited
        if (visited.has(neighbor.vertex)) continue;
        visited.add(neighbor.vertex);
        order.push(neighbor.vertex);

        // Add route
        routes.set(neighbor.vertex, { previous: current, data: neighbor.data });

        // Check if arrived
        if (neighbor.vertex === to) {
          return { path: this.constructPath(from, to, routes), order };
        }

        // Visit next
        queue.push(neighbor.vertex);
      }
    }

    return { path: null, order };
  }

  public dfs(
    from: string,
    to: string
  ): { path: Path<D> | null; order: string[] } {
    const visited: Set<string> = new Set([from]);
    const order: string[] = [];
    const routes: Routes<D> = new Map();

    const next = (current: string): boolean => {
      order.push(current);
      if (current === to) return true;
      const neighbors = this.adjacencyList.get(current) ?? [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor.vertex)) continue;
        visited.add(neighbor.vertex);
        routes.set(neighbor.vertex, { previous: current, data: neighbor.data });
        if (next(neighbor.vertex)) {
          return true;
        }
      }
      return false;
    };

    return next(from)
      ? { path: this.constructPath(from, to, routes), order }
      : { path: null, order };
  }

  private constructPath(from: string, to: string, routes: Routes<D>): Path<D> {
    const path: Path<D> = [];
    let current = to;
    while (current !== from) {
      const route = routes.get(current)!;
      path.unshift({ from: route.previous, to: current, data: route.data });
      current = route.previous;
    }
    return path;
  }
}
