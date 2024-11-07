export type KeyPair = [string, string];

export type PubKey = KeyPair[];
export type PrivKey = KeyPair[];

export type LamportKeyPair = {
  privateKeys: PrivKey;
  publicKeys: PubKey;
};

export type HashType = "keccak256" | "sha256";
export type EncodeType = "hex" | "ascii" | "utf-8";
export type InitMode = "new" | "load";

export type LamportSignature = string[];

export type KeyInfo = {
  index: number;
  pubkeyHash: string;
  keys: LamportKeyPair;
};
