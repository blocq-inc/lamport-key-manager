import { KEY_DIR_NAME, KEY_FILE_NAME } from "../consts";
import { LamportKeyManager } from "../lamport-key-manager";
import fs from "fs";

describe("Manager", () => {
  describe("new", () => {
    afterEach(() => {
      const pwd = process.cwd();
      fs.rmSync(`${pwd}/${KEY_DIR_NAME}/${KEY_FILE_NAME}`, { force: true });
      fs.rmdirSync(`${pwd}/${KEY_DIR_NAME}`, { recursive: true });
    });

    it("should generate new keys and save to the file", () => {
      new LamportKeyManager("new");

      const file = fs.readFileSync("./keys/keys.json", "utf-8");

      expect(file).toBeDefined();
    });
  });

  describe("load", () => {
    afterEach(() => {
      const pwd = process.cwd();
      fs.rmSync(`${pwd}/${KEY_DIR_NAME}/${KEY_FILE_NAME}`, { force: true });
      fs.rmdirSync(`${pwd}/${KEY_DIR_NAME}`, { recursive: true });
    });

    it("should load existing keys from the file if it exists", () => {
      new LamportKeyManager("new");
      const manager = new LamportKeyManager("load");
      expect(manager.currentPubKeyHash).toBeDefined();
      expect(() => manager.nextPubKeyHash).toThrow();
      expect(manager.lamportKeys).toBeDefined();
      expect(manager.lamportKeys.length).toBe(1);
    });

    it("should generate next keys", () => {
      new LamportKeyManager("new");
      const manager = new LamportKeyManager("load");
      manager.generateNextKeys();

      expect(manager.currentPubKeyHash).toBeDefined();
      expect(manager.nextPubKeyHash).toBeDefined();
      expect(manager.lamportKeys.length).toBe(2);

      // different pubkey hash from the previous one
      expect(manager.currentPubKeyHash).not.toBe(manager.nextPubKeyHash);
    });
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

  describe("isKeyDirExist", () => {
    it("should check if ./keys directory exists", () => {
      const res = LamportKeyManager.isKeyDirExist();
      expect(res).toBe(false);

      const pwd = process.cwd();
      fs.mkdirSync(`${pwd}/${KEY_DIR_NAME}`);
      expect(LamportKeyManager.isKeyDirExist()).toBe(true);

      fs.rmdirSync(`${pwd}/${KEY_DIR_NAME}`, { recursive: true });
      expect(LamportKeyManager.isKeyDirExist()).toBe(false);
    });
  });
});
