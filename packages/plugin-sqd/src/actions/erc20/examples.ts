import { ActionExample } from "@elizaos/core";

export const erc20Examples: ActionExample[][] = [
    [
        {
            user: "user",
            content: {
                text: "Get ERC20 transfers from 0x1234567890123456789012345678901234567890 to 0x4567890123456789012345678901234567890123",
                params: {
                    from: "0x1234567890123456789012345678901234567890",
                    to: "0x4567890123456789012345678901234567890123",
                    startBlock: null,
                    endBlock: null,
                    contractAddress: null,
                },
            },
        },
        {
            user: "assistant",
            content: {
                text: "Here are the ERC20 transfers matching your criteria",
                success: true,
                params: {
                    from: "0x1234567890123456789012345678901234567890",
                    to: "0x4567890123456789012345678901234567890123",
                    startBlock: null,
                    endBlock: null,
                    contractAddress: null,
                },
                data: {
                    transfers: [
                        {
                            from: "0x1234567890123456789012345678901234567890",
                            to: "0x4567890123456789012345678901234567890123",
                            value: BigInt("1000000000000000000"),
                            address:
                                "0xdac17f958d2ee523a2206206994597c13d831ec7",
                            decimals: 6,
                            symbol: "USDT",
                            blockTimestamp: 1704067200,
                            blockNumber: 18900000,
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
                text: "Show me ERC20 transfers between blocks 15000000 and 15001000",
                params: {
                    from: null,
                    to: null,
                    startBlock: 15000000,
                    endBlock: 15001000,
                    contractAddress: null,
                },
            },
        },
        {
            user: "assistant",
            content: {
                text: "Found transfers within the specified block range",
                success: true,
                params: {
                    from: null,
                    to: null,
                    startBlock: 15000000,
                    endBlock: 15001000,
                    contractAddress: null,
                },
                data: {
                    transfers: [
                        {
                            from: "0xdef1cafe0000000000000000000000000000dead",
                            to: "0xbeef0000000000000000000000000000deadbeef",
                            value: BigInt("500000000000000000"),
                            address:
                                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                            decimals: 6,
                            symbol: "USDC",
                            blockTimestamp: 1704153600,
                            blockNumber: 15000500,
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
                text: "Get transfers for USDC token contract at 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                params: {
                    from: null,
                    to: null,
                    startBlock: null,
                    endBlock: null,
                    contractAddress:
                        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                },
            },
        },
        {
            user: "assistant",
            content: {
                text: "Here are the USDC token transfers I found",
                success: true,
                params: {
                    from: null,
                    to: null,
                    startBlock: null,
                    endBlock: null,
                    contractAddress:
                        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                },
                data: {
                    transfers: [
                        {
                            from: "0x000000000000000000000000000000000000dead",
                            to: "0xbeefcafe000000000000000000000000deadbeef",
                            value: BigInt("1000000"),
                            address:
                                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                            decimals: 6,
                            symbol: "USDC",
                            blockTimestamp: 1704240000,
                            blockNumber: 19000000,
                        },
                    ],
                },
            },
        },
    ],
];
