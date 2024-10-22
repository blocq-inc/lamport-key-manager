export type KeyPair = [string, string];

export type LamportKeyPair = {
  privateKeys: KeyPair[];
  publicKeys: KeyPair[];
};

export type InitMode = "new" | "load";

export type Signature = string[];

export type KeyInfo = {
  index: number;
  pubkeyHash: string;
  keys: LamportKeyPair;
};
