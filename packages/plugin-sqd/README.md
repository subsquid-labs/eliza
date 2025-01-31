# @elizaos/plugin-sqd

A plugin that provides on-chain data lake capabilities for AI agents in the elizaos ecosystem.

## Description

The SQD plugin enables AI agents to query and analyze on-chain data from Arbitrum One, specifically focusing on:

-   ERC20 token transfers
-   Uniswap V3 pool swaps

The plugin offers data providers that can parse natural language queries and fetch relevant blockchain data using SQD's data lake infrastructure.

## Features

### ERC20 Transfer Provider

Allows querying ERC20 transfer events with the following parameters:

-   Start block
-   End block
-   From address
-   To address
-   Token contract address

The data included in the agent's context follows this structure:

```typescript
interface Erc20Transfer {
    from: string;
    to: string;
    value: bigint;
    address: string;
    decimals: number;
    symbol: string;
    blockTimestamp: number;
    blockNumber: number;
}
```

### Uniswap V3 Provider

Enables analysis of Uniswap V3 pool swaps with:

-   Start block
-   End block
-   Pool address

The swap data follows this structure:

```typescript
interface Swap {
    sender: string;
    recipient: string;
    amount0: bigint;
    amount1: bigint;
    sqrtPriceX96: bigint;
    liquidity: bigint;
    tick: number;
    address: string;
    poolName: string; // Format: "TOKEN0/TOKEN1"
}
```

## Usage

### In your agent configuration:

```json
{
    "plugins": ["@elizaos/plugin-sqd"],
    // Add the providers you want to use or leave empty to use all
    "providers": ["erc20Provider", "uniswapProvider"]
}
```

### Example Queries

For ERC20 transfers:

```
Find the highest value transfer between blocks 290000000 and 290010000 of the token 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9
```

For Uniswap V3 swaps:

```
Tell me some facts about the swaps in the pool 0xC6962004f452bE9203591991D15f6b388e09E8D0 between blocks 300308838 and 300318838
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is part of the Eliza project. See the main project repository for license information.
