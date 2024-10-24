import { InitMode, LamportKeyPair, KeyPair, PrivKey, PubKey } from "./types";
export declare class Manager {
    privateKeys: PrivKey[];
    publicKeys: PubKey[];
    lamportKeys: LamportKeyPair[];
    constructor(mode?: InitMode);
    initPrivateKeys(mode?: InitMode): KeyPair[][];
    get privKeys(): KeyPair[][];
    get currentPrivKey(): PrivKey;
    get pubKeys(): KeyPair[][];
    get currentPubKey(): PubKey;
    get lamportKeyPairs(): LamportKeyPair[];
    get currentLamportKeyPair(): LamportKeyPair;
    get currentPubKeyHash(): string;
    get nextPubKeyHash(): string;
    generateNextKeys(): LamportKeyPair;
    static isKeyFileExist(): boolean;
    private getPubKeyHashFromPublicKey;
    private generatePrivateKeys;
    private getPublicKeyFromPrivateKey;
    private readKeyFile;
    private saveKeys;
    private hash;
}
//# sourceMappingURL=manager.d.ts.map