import {
  EncodeType,
  HashType,
  LamportKeyPair,
  LamportSignature,
} from "./types";
import { keccak256Hash } from "./crypto/keccak256";

export class LamportSigner {
  private keys: LamportKeyPair;

  constructor(keys: LamportKeyPair, hash: HashType = "keccak256") {
    this.keys = keys;
  }

  // method for signing
  sign(message: string, type: EncodeType = "hex"): LamportSignature {
    const hash = this.hash(message, type);
    const binaryStringOfHash = BigInt(hash).toString(2).padStart(256, "0");

    const signature: LamportSignature = [...binaryStringOfHash].map(
      (value: string, idx: number) =>
        "0x" + this.keys.privateKeys[idx][Number(value)]
    );
    return signature;
  }

  // method for verification test
  verify(
    message: string,
    messageType: EncodeType,
    signature: LamportSignature
  ): boolean {
    const hash = this.hash(message, messageType);
    const binaryStringOfHash = BigInt(hash).toString(2).padStart(256, "0");

    const selectedPubKeys = ([...binaryStringOfHash] as ("0" | "1")[]).map(
      (val: "0" | "1", idx: number) => this.keys.publicKeys[idx][Number(val)]
    );

    for (let i = 0; i < selectedPubKeys.length; i++) {
      if (selectedPubKeys[i] !== this.hash(signature[i].slice(2), "hex")) {
        return false;
      }
    }

    return true;
  }

  // hash function for keccak256 in ethereum
  private hash(message: string, type: EncodeType): string {
    switch (type) {
      case "hex":
        return keccak256Hash(message, "hex");
      case "utf-8":
        return keccak256Hash(message, "utf-8");
      case "ascii":
        return keccak256Hash(message, "ascii");
      default:
        throw Error("invalid encode type");
    }
  }
}
