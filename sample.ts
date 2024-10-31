import { Manager } from "./src/manager";
import { LamportSigner } from "./src/lamport-signer";

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

  console.log("currentPubKeyHash", manager.currentPubKeyHash);

  console.log("lamportKeys", manager.lamportKeys.length);
  // 2. generate signature(sign)
  const signer = new LamportSigner(manager.lamportKeys[0]);
  const signature = signer.sign(message);

  // 3. verify signature(on the server side)
  const isValid = signer.verify(message, "utf-8", signature);
  console.log(isValid);

  // 4. send signature to the contract

  // send: signature, publicKeys ,nextPubKeyHash

  // 4-1. generate next lamport keys and save to the local file

  const nextLamportKeyPair = manager.generateNextKeys();

  pubKeyHash2 = manager.currentPubKeyHash;

  if (pubKeyHash1 !== pubKeyHash2) {
    throw Error("pubKeyHash1 and pubKeyHash2 are different");
  }
  const currentPubKeyHash = manager.currentPubKeyHash;
  const nextPubKeyHash = manager.nextPubKeyHash;

  if (nextPubKeyHash === currentPubKeyHash) {
    throw Error("nextPubKeyHash and currentPubKeyHash are the same");
  }

  // 4-2. send signature, publicKeys, nextPubKeyHash to the smart contract

  // call verify() of smart contract
  // if it is valid, update new pubkey hash to the smart contract
  // args: signature, publicKeys, nextPubKeyHash
}
