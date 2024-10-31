"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LamportSigner = void 0;
const keccak256_1 = require("./crypto/keccak256");
class LamportSigner {
    keys;
    constructor(keys, hash = "keccak256") {
        this.keys = keys;
    }
    // method for signing
    sign(message, type = "hex") {
        const hash = this.hash(message, type);
        const binaryStringOfHash = BigInt(hash).toString(2).padStart(256, "0");
        const signature = [...binaryStringOfHash].map((value, idx) => "0x" + this.keys.privateKeys[idx][Number(value)]);
        return signature;
    }
    // method for verification test
    verify(message, messageType, signature) {
        const hash = this.hash(message, messageType);
        const binaryStringOfHash = BigInt(hash).toString(2).padStart(256, "0");
        const selectedPubKeys = [...binaryStringOfHash].map((val, idx) => this.keys.publicKeys[idx][Number(val)]);
        for (let i = 0; i < selectedPubKeys.length; i++) {
            if (selectedPubKeys[i] !== this.hash(signature[i].slice(2), "hex")) {
                return false;
            }
        }
        return true;
    }
    // hash function for keccak256 in ethereum
    hash(message, type) {
        switch (type) {
            case "hex":
                return (0, keccak256_1.keccak256Hash)(message, "hex");
            case "utf-8":
                return (0, keccak256_1.keccak256Hash)(message, "utf-8");
            case "ascii":
                return (0, keccak256_1.keccak256Hash)(message, "ascii");
            default:
                throw Error("invalid encode type");
        }
    }
}
exports.LamportSigner = LamportSigner;
