# Using @elizaos/plugin-sqd

1. First, clone the repo at https://github.com/subsquid-labs/eliza
    - `git clone git@github.com:subsquid-labs/eliza.git`
2. Make sure you're in the branch `feat/sqd-plugin`. This is the default branch of this repo, you should be fine
3. Copy the `.env.example` file to `.env` and add the API keys to your LLM provider of choice.
4. Run `pnpm install` in the root folder
5. `cd agent` and run `pnpm install`
6. Edit the `characters/chain-scope.character.json` file to use the LLM provider of your choice.
7. In the root folder run `pnpm run dev --characters="characters/chain-scope.character.json"`. This character file already has `@elizaos/plugin-sdq` configured by default with all actions and providers included.
    - The first build can take quite some time.
8. In a browser, go to http://localhost:5173/ and pick the Chain Scope agent
9. Start prompting.

In order to test the providers, you will need to include the following variables to `.env`. You can omit any parameters from the list, except the starting blocks. If you don't provide any of the variables in the .env file, providers won't run.

```sh
#### ERC20 Provider Variables
SQD_ERC20_START_BLOCK: #290000000
SQD_ERC20_END_BLOCK: # 290010000
SQD_ERC20_FROM_ADDRESS:
SQD_ERC20_TO_ADDRESS:
SQD_ERC20_CONTRACT_ADDRESS: # 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9

#### Uniswap Provider Variables
SQD_UNISWAP_START_BLOCK: # 300000000
SQD_UNISWAP_END_BLOCK: # 300001000
SQD_UNISWAP_POOL_ADDRESS: # 0xC6962004f452bE9203591991D15f6b388e09E8D0
```

### Prompt examples for actions

Get transaction transfers from USDT

> Find all the transfer for the token 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 between the blocks 290000000 and 290010000

Export USDT transfers to a JSON file

> Find all the transfer for the token 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 between the blocks 290000000 and 290010000 and dump it to a json file

Swap events from USDC/WETH Uni pool

> Find the swap events of the pool 0xC6962004f452bE9203591991D15f6b388e09E8D0 between 290_000_000 and 290_010_000

### How to test providers

The main way to test providers is to run the agent using the command `start:debug`. This command will print out the context that's being forward to the LLM provider, and you'll be able to see the transactions being included there.
The full command is: `pnpm run dev --characters="characters/chain-scope.character.json`

### Known issues

When your provider supplies transaction data, and you then prompt the LLM with the same information expecting it to trigger an action, you might not get the result you want. This happens because the LLM already has all the details it needs, so it doesn’t see a reason to call the action to retrieve them again.
For example, let’s say your .env file is set up to fetch transaction data for a specific token from block 1 to block 100. If you ask the LLM to get all transactions, it might just return what’s already in its context instead of executing an action to retrieve them.
Most of the time, this isn’t an issue—especially if the action simply provides the same data. However, if the action is supposed to do something extra, like exporting the transactions to a JSON file, it can be confusing when it doesn’t run as expected.
