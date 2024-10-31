import { ethers } from "ethers";
export const keccak256Hash = (message, type = "hex") => {
    if (type === "hex" && message.startsWith("0x")) {
        message = message.slice(2);
    }
    return ethers.keccak256(Buffer.from(message, type));
};
