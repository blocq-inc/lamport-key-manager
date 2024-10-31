import { Manager } from "./src/manager";
import { LamportSigner } from "./src/lamport-signer";
import assert from "assert";
import { keccak256Hash } from "./src/crypto/keccak256";
import { KEY_DIR_NAME } from "./src/consts";
import fs from "fs";
// This script generate signature for a meesage.
// message to be signed
const nextPKH =
  "0x9046dad06267aa2d30b5ed86d2febd935040576fccdf193561ad09cec5d243c3";
// 1. load lamport keys
const manager = new Manager("load");

assert(nextPKH !== manager.currentPubKeyHash, "load failed");

// 2. generate signature(sign)
const signer = new LamportSigner(manager.lamportKeys[0]);
const signature = signer.sign(keccak256Hash(nextPKH, "hex"));
console.log(signature);

const pwd = process.cwd();
const path = `${pwd}/${KEY_DIR_NAME}/signature.json`;

fs.writeFileSync(path, JSON.stringify(signature));

// 3. verify signature(on the server side)
const isValid = signer.verify(keccak256Hash(nextPKH, "hex"), "hex", signature);
console.log(isValid);
