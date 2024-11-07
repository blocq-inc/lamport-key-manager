import { EncodeType, HashType, LamportKeyPair, LamportSignature } from "./types";
export declare class LamportSigner {
    private keys;
    constructor(keys: LamportKeyPair, hash?: HashType);
    sign(message: string, type?: EncodeType): LamportSignature;
    verify(message: string, messageType: EncodeType, signature: LamportSignature): boolean;
    private hash;
}
//# sourceMappingURL=lamport-signer.d.ts.map