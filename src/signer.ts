import { KeyPair, LamportKeyPair, Signature } from "./types";

export class LamportSigner {
  private keys: LamportKeyPair;

  constructor(keys: LamportKeyPair) {
    this.keys = keys;
  }

  // method for signing
  sign(message: string): Signature {
    const hash = this.hash(message);
    const signature = this.keys.privateKeys.map((key) => {
      return this.hash(key + hash);
    });
    return signature;
  }

  // method for verification test
  verify(
    message: string,
    publicKeys: KeyPair[],
    signature: Signature
  ): boolean {
    // const pubkeyHash = ;
  }
}
