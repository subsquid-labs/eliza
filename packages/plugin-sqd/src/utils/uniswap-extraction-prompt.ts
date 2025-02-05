export const getUniswapExtractionPrompt = (
    message: string
) => `Extract structured information from user queries about Uniswap activity. Output a JSON object with the following keys:
- startBlock: The earliest block number to consider in the analysis (e.g., 290000000)
- endBlock: The latest block number to consider in the analysis (e.g., 290010000)
- poolAddress: The Uniswap V3 pool contract address (e.g., "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8")
- fileFormat: The desired output format, currently only supports "json" or null

Rules:
1. Output only the JSON object with the specified keys.
2. Use null for missing or unclear information.
3. Do not include additional keys or text outside the JSON object.
4. Only return the filled JSON object if you're sure the request is about Uniswap swaps. Otherwise, return an empty object.

Examples:

Input:
"Show me all swaps in the Uniswap V3 contract 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8 between blocks 290000000 and 290010000."

Output:
\`\`\`json
{
  "startBlock": 290000000,
  "endBlock": 290010000,
  "poolAddress": "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8",
  "fileFormat": null
}
\`\`\`

Input:
"I want to analyze the USDT/USDC pool 0x3416cF6C708Da44DB2624D63ea0AAef7113527C6 swaps starting from block 290005000 and save it as json."

Output:
\`\`\`json
{
  "startBlock": 290005000,
  "endBlock": null,
  "poolAddress": "0x3416cF6C708Da44DB2624D63ea0AAef7113527C6",
  "fileFormat": "json"
}
\`\`\`

Input:
"Export all swaps from pool 0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443 between blocks 290000000 and 290050000 as json file"

Output:
\`\`\`json
{
  "startBlock": 290000000,
  "endBlock": 290050000,
  "poolAddress": "0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443",
  "fileFormat": "json"
}
\`\`\`

Input:
"Show me all swaps until block 290008000."

Output:
\`\`\`json
{
  "startBlock": null,
  "endBlock": 290008000,
  "poolAddress": null,
  "fileFormat": null
}
\`\`\`

Input:
"Give me some ERC20 transfers from 0x5f2978c2af6fbd895132231bf9a9ac2c972dc25f to 0x58012c78ce5d955a8fe59792bfdadeef64d966fc"

Output:
\`\`\`json
{}
\`\`\`
ERC20 transfers are unrelated to Uniswap dataset, returning empty object

Follow these instructions and examples to ensure the output is always a JSON object with the specified keys.

The message is: ${message}`;
