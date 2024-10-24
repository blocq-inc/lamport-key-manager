import { LamportSigner } from "../lamport-signer";
import { Manager } from "../manager";
import fs from "fs";

describe("LamportSigner", () => {
  afterAll(() => {
    fs.rmSync("./keys/keys.json", { force: true });
  });

  beforeEach(() => {
    // generate keys
    const manager = new Manager("new");
  });

  it("should sign to the message by generating keys", () => {
    const manager = new Manager("load");
    // sign by the 1st lamport keys
    const signer = new LamportSigner(manager.lamportKeys[0]);

    const message = "hello";
    const signature = signer.sign(message);

    expect(signature).toBeDefined();
    expect(signature.length).toBe(256);
  });

  it("should verify the valid signature", () => {
    const manager = new Manager("load");
    const signer = new LamportSigner(
      manager.lamportKeys[manager.lamportKeys.length - 1]
    );

    const message = "hello";
    const signature = signer.sign(message);

    expect(signer.verify(message, signature)).toBe(true);
    expect(signer.verify("hello1", signature)).toBe(false);
  });

  it("should not verify invalid message", () => {
    const manager = new Manager("load");
    const signer = new LamportSigner(
      manager.lamportKeys[manager.lamportKeys.length - 1]
    );

    expect(signer.verify("helli", signer.sign("hello"))).toBe(false);
    expect(signer.verify("aello", signer.sign("hello"))).toBe(false);
  });
});
