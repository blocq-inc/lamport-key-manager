import { Manager } from "../manager";
import fs from "fs";

describe("Manager", () => {
  afterEach(() => {
    fs.rmSync("./keys/keys.json", { force: true });
  });

  it("should generate new keys and save to the file", () => {
    new Manager("new");

    const file = fs.readFileSync("./keys/keys.json", "utf-8");

    expect(file).toBeDefined();
  });

  it("should load existing keys from the file if it exists", () => {
    new Manager("new");
    const manager = new Manager("load");
    expect(manager.currentPubKeyHash).toBeDefined();
    expect(() => manager.nextPubKeyHash).toThrow();
    expect(manager.lamportKeys).toBeDefined();
    expect(manager.lamportKeys.length).toBe(1);
  });

  it("should generate next keys", () => {
    new Manager("new");
    const manager = new Manager("load");
    manager.generateNextKeys();

    expect(manager.currentPubKeyHash).toBeDefined();
    expect(manager.nextPubKeyHash).toBeDefined();
    expect(manager.lamportKeys.length).toBe(2);

    // different pubkey hash from the previous one
    expect(manager.currentPubKeyHash).not.toBe(manager.nextPubKeyHash);
  });

  // it("should delete keys if there are more than 2 lamport keys", () => {
  //   new Manager("new");
  //   const manager = new Manager("load");
  //   manager.generateNextKeys();
  //   expect(manager.lamportKeys.length).toBe(2);
  //   // different pubkey hash from the previous one
  //   expect(manager.currentPubKeyHash).not.toBe(manager.nextPubKeyHash);
  //   expect(() => manager.generateNextKeys()).not.toThrow();

  //   manager.generateNextKeys();
  //   expect(manager.lamportKeys.length).toBe(2);
  //   // different pubkey hash from the previous one
  //   expect(manager.currentPubKeyHash).not.toBe(manager.nextPubKeyHash);
  // });
});
