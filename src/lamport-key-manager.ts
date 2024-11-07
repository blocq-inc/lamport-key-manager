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
import {
  KEY_DIR_NAME,
  KEY_LENGTH_IN_BYTES,
  NUMBER_OF_KEYS_IN_LAMPORT,
} from "./consts";
import { keccak256Hash } from "./crypto/keccak256";

export class LamportKeyManager {
  privateKeys: PrivKey[] = [];
  publicKeys: PubKey[] = [];
  lamportKeys: LamportKeyPair[] = [];

  constructor(mode: InitMode = "new") {
    if (mode === "new") {
      if (!LamportKeyManager.isKeyDirExist()) {
        const pwd = process.cwd();
        try {
          fs.mkdirSync(`${pwd}/${KEY_DIR_NAME}`);
        } catch (error) {
          throw new Error(`Failed to create directory: /${KEY_DIR_NAME}`);
        }
      }
      if (!LamportKeyManager.isKeyFileExist()) {
        const privateKeys = this.initPrivateKeys();
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
      throw new Error(
        "keys.json already exists. remove keys/keys.json or use 'load' as option in constructor"
      );
    }

    if (mode === "load") {
      const keys = this.readKeyFile();
      this.privateKeys = keys.map((key) => key.keys.privateKeys);
      this.publicKeys = keys.map((key) => key.keys.publicKeys);
      this.lamportKeys = keys.map((key) => {
        return {
          privateKeys: key.keys.privateKeys,
          publicKeys: key.keys.publicKeys,
        };
      });
      return;
    }

    throw new Error(`Invalid mode: ${mode}`);
  }

  initPrivateKeys(): KeyPair[][] {
    return [this.generatePrivateKeys()];
  }

  get privKeys(): KeyPair[][] {
    return this.privateKeys;
  }

  get currentPrivKey(): PrivKey {
    if (this.privateKeys.length < 2) {
      throw new Error("No previous private key");
    }
    // last - 1 becomes current private key
    return this.privateKeys[this.privateKeys.length - 2];
  }

  get pubKeys(): KeyPair[][] {
    return this.publicKeys;
  }

  get currentPubKey(): PubKey {
    if (this.publicKeys.length < 2) {
      throw new Error("No previous public key");
    }

    // last - 1 becomes current public key
    return this.publicKeys[this.publicKeys.length - 2];
  }

  get lamportKeyPairs(): LamportKeyPair[] {
    return this.lamportKeys;
  }

  get currentLamportKeyPair(): LamportKeyPair {
    if (this.lamportKeys.length < 2) {
      throw new Error("keys should be generated at least twice");
    }
    // last - 1 becomes current lamport key pair
    return this.lamportKeys[this.lamportKeys.length - 2];
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

  public static isKeyDirExist(): boolean {
    try {
      const pwd = process.cwd();
      const dir = fs.readdirSync(`${pwd}`);

      if (dir.length > 0 && dir.includes(KEY_DIR_NAME)) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  public static isKeyFileExist(): boolean {
    if (!LamportKeyManager.isKeyDirExist()) {
      return false;
    }
    try {
      const pwd = process.cwd();
      const file = JSON.parse(
        fs.readFileSync(`${pwd}/keys/keys.json`, "utf-8")
      );
      if (file) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
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
      const pwd = process.cwd();
      return JSON.parse(fs.readFileSync(`${pwd}/keys/keys.json`, "utf-8"));
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
      const pwd = process.cwd();
      fs.writeFileSync(`${pwd}/keys/keys.json`, JSON.stringify(keyInfo));
    } catch (error) {
      throw new Error("Failed to save keys");
    }
  }

  // hash function for keccak256 in ethereum
  private hash(message: string): string {
    return keccak256Hash(message);
  }
}
