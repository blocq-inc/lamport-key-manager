import { ethers } from "ethers";
import { EncodeType } from "../types";

export const keccak256Hash = (
  message: string,
  type: EncodeType = "hex"
): string => {
  if (message.startsWith("0x")) {
    message = message.slice(2);
  }
  return ethers.keccak256(Buffer.from(message, type));
};
