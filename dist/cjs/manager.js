"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const ethers_1 = require("ethers");
const consts_1 = require("./consts");
const keccak256_1 = require("./crypto/keccak256");
class Manager {
    privateKeys = [];
    publicKeys = [];
    lamportKeys = [];
    constructor(mode = "new") {
        if (mode === "new") {
            if (!Manager.isKeyDirExist()) {
                const pwd = process.cwd();
                try {
                    fs_1.default.mkdirSync(`${pwd}/${consts_1.KEY_DIR_NAME}`);
                }
                catch (error) {
                    throw new Error(`Failed to create directory: /${consts_1.KEY_DIR_NAME}`);
                }
            }
            if (!Manager.isKeyFileExist()) {
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
            throw new Error("keys.json already exists. remove keys/keys.json or use 'load' as option in constructor");
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
    initPrivateKeys() {
        return [this.generatePrivateKeys()];
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
    static isKeyDirExist() {
        try {
            const pwd = process.cwd();
            const dir = fs_1.default.readdirSync(`${pwd}`);
            if (dir.length > 0 && dir.includes(consts_1.KEY_DIR_NAME)) {
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    static isKeyFileExist() {
        if (!Manager.isKeyDirExist()) {
            return false;
        }
        try {
            const pwd = process.cwd();
            const file = JSON.parse(fs_1.default.readFileSync(`${pwd}/keys/keys.json`, "utf-8"));
            if (file) {
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    getPubKeyHashFromPublicKey(publicKey) {
        const hash = this.hash(ethers_1.ethers.solidityPacked(["bytes32[2][256]"], [publicKey]));
        return hash;
    }
    generatePrivateKeys() {
        const privateKeys = Array.from({ length: consts_1.NUMBER_OF_KEYS_IN_LAMPORT }, () => {
            const key1 = crypto_1.default.randomBytes(consts_1.KEY_LENGTH_IN_BYTES).toString("hex");
            const key2 = crypto_1.default.randomBytes(consts_1.KEY_LENGTH_IN_BYTES).toString("hex");
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
            return JSON.parse(fs_1.default.readFileSync(`${pwd}/keys/keys.json`, "utf-8"));
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
            fs_1.default.writeFileSync(`${pwd}/keys/keys.json`, JSON.stringify(keyInfo));
        }
        catch (error) {
            throw new Error("Failed to save keys");
        }
    }
    // hash function for keccak256 in ethereum
    hash(message) {
        return (0, keccak256_1.keccak256Hash)(message);
    }
}
exports.Manager = Manager;
