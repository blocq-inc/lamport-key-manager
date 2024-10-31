import { EncodeType, HashType, LamportKeyPair, Signature } from "./types";
export declare class LamportSigner {
    private keys;
    constructor(keys: LamportKeyPair, hash?: HashType);
    sign(message: string, type?: EncodeType): Signature;
    verify(message: string, messageType: EncodeType, signature: Signature): boolean;
    private hash;
}
//# sourceMappingURL=lamport-signer.d.ts.map