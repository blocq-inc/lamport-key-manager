import {
  InitMode,
  KeyInfo,
  LamportKeyPair,
  KeyPair,
  PrivKey,
  PubKey,
} from "./types";
import crypto from "crypto";
import fs from "fs";
import { ethers } from "ethers";
import { KEY_LENGTH_IN_BYTES, NUMBER_OF_KEYS_IN_LAMPORT } from "./consts";
import { keccak256Hash } from "./crypto/keccak256";

export class Manager {
  privateKeys: PrivKey[] = [];
  publicKeys: PubKey[] = [];
  lamportKeys: LamportKeyPair[] = [];

  constructor(mode: InitMode = "new") {
    if (mode === "new") {
      const privateKeys = this.initPrivateKeys("new");
      const publicKeys = this.getPublicKeyFromPrivateKey(privateKeys[0]);
      this.privateKeys = privateKeys;
      this.publicKeys.push(publicKeys);
      this.lamportKeys.push({
        privateKeys: privateKeys[0],
        publicKeys,
      });

      this.saveKeys(this.lamportKeys);
      return;
    }

    if (mode === "load") {
      const keys = this.readKeyFile();
      this.privateKeys = this.initPrivateKeys("load");
      this.publicKeys = keys.map((key) => key.keys.publicKeys);
      this.lamportKeys = keys.map((key) => {
        return {
          privateKeys: key.keys.privateKeys,
          publicKeys: key.keys.publicKeys,
        };
      });
      return;
    }

    throw new Error("Invalid mode");
  }

  initPrivateKeys(mode: InitMode = "new"): KeyPair[][] {
    if (mode === "new") {
      return [this.generatePrivateKeys()];
    }
    if (mode === "load") {
      return this.readKeyFile().map((key) => key.keys.privateKeys);
    }
    throw new Error("Invalid mode");
  }

  get privKeys(): KeyPair[][] {
    return this.privateKeys;
  }

  get pubKeys(): KeyPair[][] {
    return this.publicKeys;
  }

  get lamportKeyPairs(): LamportKeyPair[] {
    return this.lamportKeys;
  }

  get currentPubKeyHash() {
    if (this.publicKeys.length === 0) {
      throw new Error("No current public key hash");
    }
    if (this.publicKeys.length === 1) {
      return this.getPubKeyHashFromPublicKey(this.publicKeys[0]);
    }

    if (this.publicKeys.length > 1) {
      return this.getPubKeyHashFromPublicKey(
        this.publicKeys[this.publicKeys.length - 2] // get (last - 1) public key
      );
    }
    throw new Error("No current public key hash");
  }

  get nextPubKeyHash() {
    if (this.publicKeys.length <= 1) {
      throw new Error("No next public key hash");
    }
    return this.getPubKeyHashFromPublicKey(
      this.publicKeys[this.publicKeys.length - 1] // get last public key
    );
  }

  generateNextKeys(): LamportKeyPair {
    const privateKeys = this.generatePrivateKeys();
    const publicKeys = this.getPublicKeyFromPrivateKey(privateKeys);
    this.privateKeys.push(privateKeys);
    this.publicKeys.push(publicKeys);
    this.lamportKeys.push({
      privateKeys,
      publicKeys,
    });
    this.saveKeys(this.lamportKeys);

    return this.lamportKeys[this.lamportKeys.length - 1];
  }

  private getPubKeyHashFromPublicKey(publicKey: KeyPair[]): string {
    const hash = this.hash(
      ethers.solidityPacked(["bytes32[2][256]"], [publicKey])
    );
    return hash;
  }

  private generatePrivateKeys(): KeyPair[] {
    const privateKeys: KeyPair[] = Array.from(
      { length: NUMBER_OF_KEYS_IN_LAMPORT },
      () => {
        const key1 = crypto.randomBytes(KEY_LENGTH_IN_BYTES).toString("hex");
        const key2 = crypto.randomBytes(KEY_LENGTH_IN_BYTES).toString("hex");
        return [key1, key2];
      }
    );
    return privateKeys;
  }

  private getPublicKeyFromPrivateKey(privateKey: PrivKey): PubKey {
    return privateKey.map((keyPair) => [
      this.hash(keyPair[0]),
      this.hash(keyPair[1]),
    ]);
  }

  private readKeyFile(): KeyInfo[] {
    try {
      return JSON.parse(fs.readFileSync("./keys/keys.json", "utf-8"));
    } catch (error) {
      throw new Error("Failed to load keys");
    }
  }

  private saveKeys(keys: LamportKeyPair[]): void {
    const keyInfo: KeyInfo[] = keys.map((key, index) => ({
      index: index + 1,
      pubkeyHash: this.getPubKeyHashFromPublicKey(key.publicKeys),
      keys: key,
    }));
    try {
      fs.writeFileSync("./keys/keys.json", JSON.stringify(keyInfo));
    } catch (error) {
      throw new Error("Failed to save keys");
    }
  }

  // hash function for keccak256 in ethereum
  private hash(message: string): string {
    return keccak256Hash(message);
  }
}
