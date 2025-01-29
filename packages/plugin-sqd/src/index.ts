import { Plugin } from "@elizaos/core";
import { erc20Provider, uniswapProvider } from "./providers";

export const sqdPlugin: Plugin = {
    name: "SQD",
    description: "On-chain data lake for AI agents",
    actions: [],
    evaluators: [],
    providers: [erc20Provider],
};

export default sqdPlugin;
