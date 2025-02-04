import { Plugin } from "@elizaos/core";
import { erc20Provider, uniswapProvider } from "./providers";
import { getErc20TransfersAction } from "./actions";
import { getUniswapSwapsAction } from "./actions/uniswap/uniswap.action";

// Add BigInt serialization support for JSON.stringify
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export const sqdPlugin: Plugin = {
    name: "SQD",
    description: "On-chain data lake for AI agents",
    actions: [getErc20TransfersAction, getUniswapSwapsAction],
    evaluators: [],
    providers: [erc20Provider, uniswapProvider],
};

export default sqdPlugin;
