import { Erc20TransferParams, UniswapSwapParams } from "../types";

/**
 * Service to query SQD's jellyfishes
 */
export class JellyfishService {
    public static fetchErc20Transfers(_params: Erc20TransferParams) {
        return `
            ** ERC20 transfers **

            From: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B000000003, To: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B331Feae83, Amount: 1000 USDC
            From: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B000000003, To: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B331Feae83, Amount: 1000 WETH
            From: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B000000003, To: 0x3f3aFB574Fa2B3D002ebc9a65AF8C7B331Feae83, Amount: 1000 BTCB
        `;
    }

    public static fetchUniswapSwaps(_params: UniswapSwapParams) {
        return `
            ** Uniswap swaps **

            Pool: USDC-WETH, Input amount: 100 USDC, Ouput amount: 0.01 WETH
            Pool: USDC-WETH, Input amount: 1000 USDC, Ouput amount: 0.1 WETH
            Pool: USDC-WETH, Input amount: 10000 USDC, Ouput amount: 1 WETH
            Pool: USDC-WETH, Input amount: 100000 USDC, Ouput amount: 10 WETH
        `;
    }
}
