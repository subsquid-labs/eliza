export const getErc20ExtractionPrompt = (message: string) =>
    `Extract structured information from user queries about ERC20 events on EVM chains. Output a JSON object with the following keys:
- startBlock: The earliest block number to consider in the analysis (e.g., 290000000).
- endBlock: The latest block number to consider in the analysis (e.g., 290010000).
- from: Sender Ethereum address (e.g., "0x123abc...").
- to: Receiver Ethereum address (e.g., "0x456def...").
- contractAddress: The ERC20 token contract address (e.g., "0x789ghi...").
- fileFormat: The desired output format, currently only supports "json" or null.

Rules:
1. Output only the JSON object with the specified keys.
2. Use null for missing or unclear information.
3. Do not include additional keys or text outside the JSON object.
4. Response with an empty object if the prompt is unrelated to ERC20 transfers

Examples:

Input:
"Show me the total USDC token transfers (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) from address 0x5f2978c2af6fbd895132231bf9a9ac2c972dc25f to 0x58012c78ce5d955a8fe59792bfdadeef64d966fc between blocks 290000000 and 290010000."

Output:
\`\`\`json
{
  "startBlock": 290000000,
  "endBlock": 290010000,
  "from": "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
  "to": "0xEfGhIj4567890123EfGhIj4567890123EfGhIj45",
  "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "fileFormat": null
}
\`\`\`

Input:
"Find all the transfer for the token 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9 between the blocks 290000000 and 290010000 and give me in a json file"

Output:
\`\`\`json
{
  "startBlock": 290000000,
  "endBlock": 290010000,
  "from": null,
  "to": null,
  "contractAddress": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  "fileFormat": "json"
}
\`\`\`

Input:
"I want to see all DAI (0x6B175474E89094C44Da98b954EedeAC495271d0F) transfers from 0xAAA000111222333444555666777888999000AAA000 to 0xBBB111222333444555666777888999000BBB111 starting from block 290005000."

Output:
\`\`\`json
{
  "startBlock": 290005000,
  "endBlock": null,
  "from": "0xAAA000111222333444555666777888999000AAA000",
  "to": "0xBBB111222333444555666777888999000BBB111",
  "contractAddress": "0xDAIcontractAddress",
  "fileFormat": null
}
\`\`\`

Input:
"Hey, run an analysis of transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5 until block 290008000."

Output:
\`\`\`json
{
  "startBlock": null,
  "endBlock": 290008000,
  "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
  "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5",
  "contractAddress": null,
  "fileFormat": null
}
\`\`\`

Input:
"Give me the data for token 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5."

Output:
\`\`\`json
{
  "startBlock": null,
  "endBlock": null,
  "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
  "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5",
  "contractAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "fileFormat": null
}
\`\`\`

Input:
"Give me all trades up to block 290010000."

Output:
\`\`\`json
{}
\`\`\`
Not related to ERC20 transfers, returns empty object

Follow these instructions and examples to ensure the output is always a JSON object with the specified keys.

The message is: ${message}`;
