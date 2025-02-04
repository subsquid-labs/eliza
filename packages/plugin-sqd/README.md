# @elizaos/plugin-sqd

A plugin that provides on-chain data lake capabilities for AI agents in the elizaos ecosystem.

## Description

The SQD plugin enables AI agents to query and analyze on-chain data from Arbitrum One, specifically focusing on:

-   ERC20 token transfers
-   Uniswap V3 pool swaps

The plugin implements both providers and actions to offer flexibility in how data is accessed and processed.

## Architecture

### Providers vs Actions

The plugin implements two complementary approaches to data access:

1. **Providers**: Simple, environment-variable driven data providers that fetch data based on predefined settings. Useful for continuous monitoring or when parameters are known in advance.

2. **Actions**: More sophisticated handlers that can parse natural language queries, extract parameters, and offer additional features like JSON file output. Ideal for interactive queries and data analysis.

## Features

### ERC20 Transfer Capabilities

Available through both provider and action interfaces:

-   Query Parameters:
    -   Start block
    -   End block
    -   From address
    -   To address
    -   Token contract address

Data structure:

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
    transactionHash: string;
}
```

### Uniswap V3 Capabilities

Available through both provider and action interfaces:

-   Query Parameters:
    -   Start block
    -   End block
    -   Pool address

Data structure:

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

## Configuration

### Environment Variables

#### ERC20 Provider Variables

-   `SQD_ERC20_START_BLOCK`: Starting block number for transfer queries
-   `SQD_ERC20_END_BLOCK`: Ending block number for transfer queries
-   `SQD_ERC20_FROM_ADDRESS`: Filter transfers from this address
-   `SQD_ERC20_TO_ADDRESS`: Filter transfers to this address
-   `SQD_ERC20_CONTRACT_ADDRESS`: Filter transfers for specific token contract

#### Uniswap Provider Variables

-   `SQD_UNISWAP_START_BLOCK`: Starting block number for swap queries
-   `SQD_UNISWAP_END_BLOCK`: Ending block number for swap queries
-   `SQD_UNISWAP_POOL_ADDRESS`: Filter swaps for specific pool address

### Plugin Configuration

```json
{
    "plugins": ["@elizaos/plugin-sqd"],
    // Add the providers you want to use or leave empty to use all
    "providers": ["erc20Provider", "uniswapProvider"]
}
```

## Usage Examples

### Using Actions

For ERC20 transfers with JSON output:

```
Find the transfers between blocks 290000000 and 290010000 of the token 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9 and save to json
```

For Uniswap V3 swaps with JSON output:

```
Get the swaps in the pool 0xC6962004f452bE9203591991D15f6b388e09E8D0 between blocks 300000000 and 300001000
```

### Using Providers

Providers will automatically fetch data based on the configured environment variables and return formatted text output.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is part of the Eliza project. See the main project repository for license information.
