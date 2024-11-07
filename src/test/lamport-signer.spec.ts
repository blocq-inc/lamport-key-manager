import { KEY_DIR_NAME, KEY_FILE_NAME } from "../consts";
import { LamportSigner } from "../lamport-signer";
import { LamportKeyManager } from "../lamport-key-manager";
import fs from "fs";

afterAll(() => {
  const pwd = process.cwd();
  fs.rmSync(`${pwd}/${KEY_DIR_NAME}/${KEY_FILE_NAME}`, { force: true });
  fs.rmdirSync(`${pwd}/${KEY_DIR_NAME}`, { recursive: true });
});
describe("LamportSigner", () => {
  beforeAll(() => {
    // generate keys
    new LamportKeyManager("new");
  });

  it("should sign to the message by generating keys", () => {
    const manager = new LamportKeyManager("load");
    // sign by the 1st lamport keys
    const signer = new LamportSigner(manager.lamportKeys[0]);

    const message = "hello";
    const signature = signer.sign(message);

    expect(signature).toBeDefined();
    expect(signature.length).toBe(256);
  });

  it("should verify the valid signature", () => {
    const manager = new LamportKeyManager("load");
    const signer = new LamportSigner(
      manager.lamportKeys[manager.lamportKeys.length - 1]
    );

    const message = "hello";
    const signature = signer.sign(message, "utf-8");

    expect(signer.verify(message, "utf-8", signature)).toBe(true);
    expect(signer.verify("hello1", "utf-8", signature)).toBe(false);
  });

  it("should not verify invalid message", () => {
    const manager = new LamportKeyManager("load");
    const signer = new LamportSigner(
      manager.lamportKeys[manager.lamportKeys.length - 1]
    );

    expect(signer.verify("helli", "utf-8", signer.sign("hello", "utf-8"))).toBe(
      false
    );
    expect(signer.verify("aello", "utf-8", signer.sign("hello", "utf-8"))).toBe(
      false
    );
  });
});
