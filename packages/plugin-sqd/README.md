# @elizaos/plugin-sqd

A plugin that provides on-chain data lake capabilities for AI agents in the elizaos ecosystem.

## Description

The SQD plugin enables AI agents to query and analyze on-chain data, specifically focusing on:

- ERC20 token transfers
- Uniswap swap activities

The plugin provides data providers that can parse natural language queries and fetch relevant blockchain data.

## Features

### ERC20 Transfer Provider

Allows querying ERC20 transfer events with the following parameters:

- Start timestamp
- End timestamp
- From address
- To address

### Uniswap Provider

Enables analysis of Uniswap swap activities with:

- Start timestamp
- End timestamp

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
"Show me the total token transfers from 0xAbCd... to 0xEfGh... between October 1, 2023, and October 31, 2023"
```

For Uniswap swaps:

```
"Analyze swaps between October 1, 2023 (12:00 AM UTC) and October 31, 2023 (11:59 PM UTC)"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This plugin is part of the Eliza project. See the main project repository for license information.
