"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keccak256Hash = void 0;
const ethers_1 = require("ethers");
const keccak256Hash = (message, type = "hex") => {
    if (message.startsWith("0x")) {
        message = message.slice(2);
    }
    return ethers_1.ethers.keccak256(Buffer.from(message, type));
};
exports.keccak256Hash = keccak256Hash;
