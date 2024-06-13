export enum Operation {
  SET = "set",
  DELETE = "delete",
}

export type Change<D> =
  | {
      operation: Operation.SET;
      value: D;
    }
  | {
      operation: Operation.DELETE;
    };

export type Transaction<D> = Map<string, Change<D>>;

/**
 * Key-value store with nested transaction handling.
 */
export class KeyValueStore<D> {
  private store: Map<string, D> = new Map();
  private transactions: Transaction<D>[] = []; // stack, e.g. [outerTx, innerTx]

  private get innerMostTransaction(): Transaction<D> | undefined {
    return this.transactions[this.transactions.length - 1];
  }

  /**
   * Checks if a key exists. If transactions are present, get the value with the following heirerachy:
   *  1. Value from inner-most tx
   *  2. Value from outer tx(s)
   *  3. Value from store (if no txs present or no changes to value in tx)
   */
  public has(key: string): boolean {
    let value = this.store.has(key);
    for (const transaction of this.transactions) {
      const change = transaction.get(key);
      if (!change) continue;
      switch (change.operation) {
        case Operation.SET:
          value = true;
          break;
        case Operation.DELETE:
          value = false;
          break;
      }
    }
    return value;
  }

  /**
   * Gets a value. If transactions are present, get the value with the following heirerachy:
   *  1. Value from inner-most tx
   *  2. Value from outer tx(s)
   *  3. Value from store (if no txs present or no changes to value in tx)
   */
  public get(key: string): D | undefined {
    let value = this.store.get(key);
    for (const transaction of this.transactions) {
      const change = transaction.get(key);
      if (!change) continue;
      switch (change.operation) {
        case Operation.SET:
          value = change.value;
          break;
        case Operation.DELETE:
          value = undefined;
          break;
      }
    }
    return value;
  }

  /**
   * Sets a value. If transaction is present, stashes change on inner-most tx, otherwise writes directly to store.
   */
  public set(key: string, value: D): void {
    if (this.innerMostTransaction) {
      this.innerMostTransaction.set(key, { operation: Operation.SET, value });
    } else {
      this.store.set(key, value);
    }
  }

  /**
   * Deletes a key-value pair. If transaction is present, stashes change on inner-most tx.
   * Returns whether or not the transaction has been deleted based on store + propagated transactions.
   */
  public delete(key: string): boolean {
    if (this.innerMostTransaction) {
      this.innerMostTransaction.set(key, { operation: Operation.DELETE });
      return this.has(key);
    } else {
      return this.store.delete(key);
    }
  }

  /**
   * Begins a new transaction but pushing a new change set to the stack.
   */
  public begin(): void {
    this.transactions.push(new Map());
  }

  /**
   * Commits a transaction. If the inner-most transaction exists within
   * an outer transaction, applies the changes to the outer transaction.
   * Otherwise applies them directly to the store if is outer-most transaction.
   */
  public commit() {
    const transaction = this.transactions.pop();
    if (!transaction) {
      throw new Error("No transaction to commit");
    }

    const isInnerTx = this.transactions.length > 0;

    for (const [key, change] of transaction.entries()) {
      if (isInnerTx) {
        this.innerMostTransaction!.set(key, change); // Next inner most tx
      } else {
        switch (change.operation) {
          case Operation.SET:
            this.store.set(key, change.value);
            break;
          case Operation.DELETE:
            this.store.delete(key);
            break;
        }
      }
    }
  }

  /**
   * Rolls back a transaction by popping inner-most transaction from the stack.
   * All changes are discarded to the inner-most transaction.
   */
  public rollback() {
    if (this.transactions.length < 1) {
      throw new Error("No transaction to rollback");
    }
    this.transactions.pop();
  }
}
