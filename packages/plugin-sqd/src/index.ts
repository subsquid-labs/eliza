import { Plugin } from "@elizaos/core";
import { erc20Provider, uniswapProvider } from "./providers";

// Add BigInt serialization support for JSON.stringify
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export const sqdPlugin: Plugin = {
    name: "SQD",
    description: "On-chain data lake for AI agents",
    actions: [],
    evaluators: [],
    providers: [erc20Provider, uniswapProvider],
};

export default sqdPlugin;
