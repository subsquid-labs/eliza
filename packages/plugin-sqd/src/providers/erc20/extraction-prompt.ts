export const getErc20ExtractionPrompt = (message: string) =>
    `
Extract structured information from user queries about ERC20 events on EVM chains. Output a JSON object with the following keys:
- startTimestamp: The earliest timestamp to consider in the analysis (e.g., "2023-10-01T00:00:00Z").
- endTimestamp: The latest timestamp to consider in the analysis (e.g., "2023-10-31T23:59:59Z").
- from: Sender Ethereum address (e.g., "0x123abc...").
- to: Receiver Ethereum address (e.g., "0x456def...").

Rules:
1. Output only the JSON object with the specified keys.
2. Use null for missing or unclear information.
3. Do not include additional keys or text outside the JSON object.
4. Response with an empty object if the prompt is unrelated to ERC20 transfers

Examples:

Input:
"Show me the total token transfers from address 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12 to 0xEfGhIj4567890123EfGhIj4567890123EfGhIj45 between October 1, 2023, and October 31, 2023."

Output:
\`\`\`json
{
  "startTimestamp": "2023-10-01T00:00:00Z",
  "endTimestamp": "2023-10-31T23:59:59Z",
  "from": "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
  "to": "0xEfGhIj4567890123EfGhIj4567890123EfGhIj45"
}
\`\`\`

Input:
"I want to see all transfers from 0xAAA000111222333444555666777888999000AAA000 to 0xBBB111222333444555666777888999000BBB111 starting from November 15, 2023."

Output:
\`\`\`json
{
  "startTimestamp": "2023-11-15T00:00:00Z",
  "endTimestamp": null,
  "from": "0xAAA000111222333444555666777888999000AAA000",
  "to": "0xBBB111222333444555666777888999000BBB111"
}
\`\`\`

Input:
"Hey, run an analysis of transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5 until December 31, 2023."

Output:
\`\`\`json
{
  "startTimestamp": null,
  "endTimestamp": "2023-12-31T23:59:59Z",
  "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
  "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5"
}
\`\`\`

Input:
"Give me the data for transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5."

Output:
\`\`\`json
{
  "startTimestamp": null,
  "endTimestamp": null,
  "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
  "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5"
}
\`\`\`

Output:
\`\`\`json
{
  "timeframe": "1 hour",
  "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
  "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5"
}
\`\`\`

Input:
"Give me all trades up to January 1, 2024, at 5 PM UTC."

Output:
\`\`\`json
{}
\`\`\`
Not related to ERC20 transfers, returning empty object

Follow these instructions and examples to ensure the output is always a JSON object with the specified keys.

The message is: ${message}
`;
