import crypto from "crypto";
import fs from "fs";
import { ethers } from "ethers";
import { KEY_LENGTH_IN_BYTES, NUMBER_OF_KEYS_IN_LAMPORT } from "./consts";
import { keccak256Hash } from "./crypto/keccak256";
export class Manager {
    privateKeys = [];
    publicKeys = [];
    lamportKeys = [];
    constructor(mode = "new") {
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
    initPrivateKeys(mode = "new") {
        if (mode === "new") {
            return [this.generatePrivateKeys()];
        }
        if (mode === "load") {
            return this.readKeyFile().map((key) => key.keys.privateKeys);
        }
        throw new Error("Invalid mode");
    }
    get privKeys() {
        return this.privateKeys;
    }
    get currentPrivKey() {
        if (this.privateKeys.length < 2) {
            throw new Error("No previous private key");
        }
        // last - 1 becomes current private key
        return this.privateKeys[this.privateKeys.length - 2];
    }
    get pubKeys() {
        return this.publicKeys;
    }
    get currentPubKey() {
        if (this.publicKeys.length < 2) {
            throw new Error("No previous public key");
        }
        // last - 1 becomes current public key
        return this.publicKeys[this.publicKeys.length - 2];
    }
    get lamportKeyPairs() {
        return this.lamportKeys;
    }
    get currentLamportKeyPair() {
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
            return this.getPubKeyHashFromPublicKey(this.publicKeys[this.publicKeys.length - 2] // get (last - 1) public key
            );
        }
        throw new Error("No current public key hash");
    }
    get nextPubKeyHash() {
        if (this.publicKeys.length <= 1) {
            throw new Error("No next public key hash");
        }
        return this.getPubKeyHashFromPublicKey(this.publicKeys[this.publicKeys.length - 1] // get last public key
        );
    }
    generateNextKeys() {
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
    static isKeyFileExist() {
        try {
            const pwd = process.cwd();
            const file = JSON.parse(fs.readFileSync(`${pwd}/keys/keys.json`, "utf-8"));
            if (file) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    getPubKeyHashFromPublicKey(publicKey) {
        const hash = this.hash(ethers.solidityPacked(["bytes32[2][256]"], [publicKey]));
        return hash;
    }
    generatePrivateKeys() {
        const privateKeys = Array.from({ length: NUMBER_OF_KEYS_IN_LAMPORT }, () => {
            const key1 = crypto.randomBytes(KEY_LENGTH_IN_BYTES).toString("hex");
            const key2 = crypto.randomBytes(KEY_LENGTH_IN_BYTES).toString("hex");
            return [key1, key2];
        });
        return privateKeys;
    }
    getPublicKeyFromPrivateKey(privateKey) {
        return privateKey.map((keyPair) => [
            this.hash(keyPair[0]),
            this.hash(keyPair[1]),
        ]);
    }
    readKeyFile() {
        try {
            const pwd = process.cwd();
            return JSON.parse(fs.readFileSync(`${pwd}/keys/keys.json`, "utf-8"));
        }
        catch (error) {
            throw new Error("Failed to load keys");
        }
    }
    saveKeys(keys) {
        const keyInfo = keys.map((key, index) => ({
            index: index + 1,
            pubkeyHash: this.getPubKeyHashFromPublicKey(key.publicKeys),
            keys: key,
        }));
        try {
            const pwd = process.cwd();
            fs.writeFileSync(`${pwd}/keys/keys.json`, JSON.stringify(keyInfo));
        }
        catch (error) {
            throw new Error("Failed to save keys");
        }
    }
    // hash function for keccak256 in ethereum
    hash(message) {
        return keccak256Hash(message);
    }
}
