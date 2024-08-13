import { KeyValueStore } from "./KeyValueStore";

describe("KeyValueStore: No Transactions", () => {
  it("can get an unset value", () => {
    const kv = new KeyValueStore<string>();
    expect(kv.get("key1")).toBeUndefined();
  });

  it("can set and get value", () => {
    const kv = new KeyValueStore<string>();
    kv.set("key1", "val1");
    expect(kv.get("key1")).toBe("val1");
  });

  it("can delete an non-existent value", () => {
    const kv = new KeyValueStore<string>();
    const deleted = kv.delete("key1");
    expect(deleted).toBeFalsy();
  });

  it("can delete an existing value", () => {
    const kv = new KeyValueStore<string>();
    kv.set("key1", "value1");
    const deleted = kv.delete("key1");
    expect(deleted).toBeTruthy();
    expect(kv.get("key1")).toBeUndefined();
  });
});

describe("KeyValueStore: Single Transaction", () => {
  it("can commit a tx", () => {
    const kv = new KeyValueStore<string>();
    // Outer (no tx)
    kv.set("outerKey", "outerVal");

    // Start tx
    kv.begin();
    kv.set("innerKey", "innerVal");
    kv.delete("outerKey");
    expect(kv.get("innerKey")).toBe("innerVal");
    expect(kv.get("outerKey")).toBeUndefined();

    // Commit tx
    kv.commit();

    // Post tx
    expect(kv.get("innerKey")).toBe("innerVal");
    expect(kv.get("outerKey")).toBeUndefined();
  });

  it("can rollback a tx", () => {
    const kv = new KeyValueStore<string>();
    // Outer (no tx)
    kv.set("outerKey", "outerVal");

    // Start tx
    kv.begin();
    kv.set("innerKey", "innerVal");
    kv.delete("outerKey");
    expect(kv.get("innerKey")).toBe("innerVal");
    expect(kv.get("outerKey")).toBeUndefined();

    // Rollback tx
    kv.rollback();

    // Post tx
    expect(kv.get("innerKey")).toBeUndefined();
    expect(kv.get("outerKey")).toBe("outerVal");
  });
});

describe("KeyValueStore: Nested Transactions", () => {
  it("can commit a tx", () => {
    const kv = new KeyValueStore<string>();
    // Outer (no tx)
    kv.set("outerKey", "outerVal");

    // Start outer tx
    kv.begin();
    kv.set("outerTxKey", "outerTxVal");

    // Start inner tx
    kv.begin();
    kv.set("innerTxKey", "innerTxVal");
    kv.delete("outerKey");
    kv.set("outerTxKey", "outerTxVal2");

    // Commit inner tx
    kv.commit();

    // Commit outer tx
    kv.commit();

    // Validate state
    expect(kv.get("outerKey")).toBeUndefined();
    expect(kv.get("outerTxKey")).toBe("outerTxVal2");
    expect(kv.get("innerTxKey")).toBe("innerTxVal");
  });

  it("can rollback inner tx", () => {
    const kv = new KeyValueStore<string>();
    // Outer (no tx)
    kv.set("outerKey", "outerVal");

    // Start outer tx
    kv.begin();
    kv.set("outerTxKey", "outerTxVal");

    // Start inner tx
    kv.begin();
    kv.set("innerTxKey", "innerTxVal");
    kv.delete("outerKey");
    kv.set("outerTxKey", "outerTxVal2");

    // Rollback inner tx
    kv.rollback();

    // Commit outer tx
    kv.commit();

    // Validate state
    expect(kv.get("outerKey")).toBe("outerVal");
    expect(kv.get("outerTxKey")).toBe("outerTxVal");
    expect(kv.get("innerTxKey")).toBeUndefined();
  });
});
