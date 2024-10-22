import { Manager } from "./src/manager";
import { LamportSigner } from "./src/signer";
import { LamportKeyPair } from "./src/types";

// # This script is usage example flow.

// # A. First time (before registration of pubkey hash)
let pubKeyHash1: string = "";
let pubKeyHash2: string = "";
{
  // 1. generate new lamport keys and save to the local file.
  const manager = new Manager("new");

  pubKeyHash1 = manager.currentPubKeyHash;

  console.log("pubKeyHash1", pubKeyHash1);
  // 2. register pubkey hash to the smart contract
  // this is on the the node server side.
}

// # B. Next time(after registration of pubkey hash)
{
  const message = "Hello, World!";
  // 1. load lamport keys
  const manager = new Manager("load");
  // const lamportKeyPair = manager.lamportKeyPair;

  // 2. generate signature(sign)
  // const signer = new LamportSigner(lamportKeyPair);
  // const signature = signer.sign(message);

  // // 3. verify signature(on the server side)
  // const isValid = signer.verify(message, lamportKeyPair.publicKeys, signature);
  // console.log(isValid);

  // 4. send signature to the server

  // send
  // signature, publicKeys ,next_pubkey_hash
  // 4-1. generate next lamport keys and save to the local file

  const nextLamportKeyPair = manager.generateNextKeys();

  pubKeyHash2 = manager.currentPubKeyHash;

  if (pubKeyHash1 !== pubKeyHash2) {
    throw Error("pubKeyHash1 and pubKeyHash2 are different");
  }
  const currentPubKeyHash = manager.currentPubKeyHash;
  const nextPubKeyHash = manager.nextPubKeyHash;
  console.log("currentPubKeyHash", currentPubKeyHash);
  console.log("nextPubKeyHash", nextPubKeyHash);

  if (nextPubKeyHash === currentPubKeyHash) {
    throw Error("nextPubKeyHash and currentPubKeyHash are the same");
  }

  // 4-2. send signature, publicKeys, nextPubKeyHash to the smart contract

  // call verify() of smart contract
  // if it is valid, update new pubkey hash to the smart contract
  // args: signature, publicKeys, nextPubKeyHash
}
