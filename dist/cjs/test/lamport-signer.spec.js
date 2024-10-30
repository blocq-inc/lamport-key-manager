"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lamport_signer_1 = require("../lamport-signer");
const manager_1 = require("../manager");
const fs_1 = __importDefault(require("fs"));
describe("LamportSigner", () => {
    afterAll(() => {
        fs_1.default.rmSync("./keys/keys.json", { force: true });
    });
    beforeEach(() => {
        // generate keys
        const manager = new manager_1.Manager("new");
    });
    it("should sign to the message by generating keys", () => {
        const manager = new manager_1.Manager("load");
        // sign by the 1st lamport keys
        const signer = new lamport_signer_1.LamportSigner(manager.lamportKeys[0]);
        const message = "hello";
        const signature = signer.sign(message);
        expect(signature).toBeDefined();
        expect(signature.length).toBe(256);
    });
    it("should verify the valid signature", () => {
        const manager = new manager_1.Manager("load");
        const signer = new lamport_signer_1.LamportSigner(manager.lamportKeys[manager.lamportKeys.length - 1]);
        const message = "hello";
        const signature = signer.sign(message);
        expect(signer.verify(message, signature)).toBe(true);
        expect(signer.verify("hello1", signature)).toBe(false);
    });
    it("should not verify invalid message", () => {
        const manager = new manager_1.Manager("load");
        const signer = new lamport_signer_1.LamportSigner(manager.lamportKeys[manager.lamportKeys.length - 1]);
        expect(signer.verify("helli", signer.sign("hello"))).toBe(false);
        expect(signer.verify("aello", signer.sign("hello"))).toBe(false);
    });
});
