import { ActionExample } from "@elizaos/core";

export const uniswapExamples: ActionExample[][] = [
    [
        {
            user: "user",
            content: {
                text: "Show me Uniswap swaps between blocks 290000000 and 290002000",
                params: {
                    startBlock: 290000000,
                    endBlock: 290002000,
                    poolAddress: null,
                },
            },
        },
        {
            user: "assistant",
            content: {
                text: "Here are the Uniswap swaps within the specified block range",
                success: true,
                params: {
                    startBlock: 290000000,
                    endBlock: 290002000,
                    poolAddress: null,
                },
                data: {
                    swaps: [
                        {
                            sender: "0x1234567890123456789012345678901234567890",
                            recipient:
                                "0x4567890123456789012345678901234567890123",
                            amount0: BigInt("1000000000000000000"),
                            amount1: BigInt("2000000000000000000"),
                            sqrtPriceX96: BigInt("1500000000000000000"),
                            liquidity: BigInt("5000000000000000000"),
                            tick: 100,
                            address:
                                "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                            poolName: "WETH/USDC",
                        },
                    ],
                },
            },
        },
    ],
    [
        {
            user: "user",
            content: {
                text: "Get swaps for Uniswap pool 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                params: {
                    startBlock: null,
                    endBlock: null,
                    poolAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                },
            },
        },
        {
            user: "assistant",
            content: {
                text: "Found swaps for the specified Uniswap pool",
                success: true,
                params: {
                    startBlock: null,
                    endBlock: null,
                    poolAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                },
                data: {
                    swaps: [
                        {
                            sender: "0xdef1cafe0000000000000000000000000000dead",
                            recipient:
                                "0xbeef0000000000000000000000000000deadbeef",
                            amount0: BigInt("500000000000000000"),
                            amount1: BigInt("1000000000000000000"),
                            sqrtPriceX96: BigInt("1200000000000000000"),
                            liquidity: BigInt("3000000000000000000"),
                            tick: 200,
                            address:
                                "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
                            poolName: "WETH/USDC",
                        },
                    ],
                },
            },
        },
    ],
];
