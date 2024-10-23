export type KeyPair = [string, string];

export type PubKey = KeyPair[];
export type PrivKey = KeyPair[];

export type LamportKeyPair = {
  privateKeys: PrivKey;
  publicKeys: PubKey;
};

export type InitMode = "new" | "load";

export type Signature = string[];

export type KeyInfo = {
  index: number;
  pubkeyHash: string;
  keys: LamportKeyPair;
};
