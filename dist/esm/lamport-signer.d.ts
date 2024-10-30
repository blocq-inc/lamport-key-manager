import { HashType, LamportKeyPair, Signature } from "./types";
export declare class LamportSigner {
    private keys;
    constructor(keys: LamportKeyPair, hash?: HashType);
    sign(message: string): Signature;
    verify(message: string, signature: Signature): boolean;
    private hash;
}
//# sourceMappingURL=lamport-signer.d.ts.map