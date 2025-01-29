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

Follow these instructions and examples to ensure the output is always a JSON object with the specified keys.

///////

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

// `
//     You are given user queries related to analyzing ERC20 events on EVM chains. You must parse each user query and extract the following pieces of information, outputting them in JSON format only with exactly these keys:
//     - timeframe: The total time window for which events are analyzed, e.g., “4 hours”, “5 minutes”, “20 days”.
//     - from: The Ethereum account that initiates transactions, e.g., “0x123abc…”.
//     - to: The Ethereum account that receives the token transfers, e.g., “0x456def…”.
//     - contract: The contract address that emitted the ERC20 transfer event, e.g., “0x789ghi…”.

//     If a piece of information is missing or unclear, output null for that field.

//     You must follow these rules:
//     1. Output only the JSON object with the above five fields: timeframe, from, to, contract.
//     2. Do not include any additional keys or text outside the JSON object.
//     3. For any value you cannot determine from the user query, output null.

//     Examples

//     Example 1

//     User Input:

//     Show me the total token transfers for the past 3 days in 4-hour candles from address 0xAbCd to 0xEfGh, and the contract is 0x1234

//     LLM Output:

//     {
//       "timeframe": "3 days",
//       "from": "0xAbCd",
//       "to": "0xEfGh",
//       "contract": "0x1234"
//     }

//     Example 2

//     User Input:

//     I want to see all transfers in 6-hour increments for the last 10 days. The tokens come from 0xAAA000 and go to 0xBBB111. Contract address isn't specified though.

//     LLM Output:

//     {
//       "timeframe": "10 days",
//       "from": "0xAAA000",
//       "to": "0xBBB111",
//       "contract": null
//     }

//     Example 3

//     User Input:

//     Hey, run a 2 day analysis of transfers on contract 0xCONTRACT

//     LLM Output:

//     {
//       "timeframe": "2 days",
//       "from": null,
//       "to": null,
//       "contract": "0xCONTRACT"
//     }

//     Example 4

//     User Input:

//     Give me the data for the last 1 hour, from 0xA1B2C3 to 0xD4E5F6, aggregated every 5 minutes on 0xTOKEN

//     LLM Output:

//     {
//       "timeframe": "1 hour",
//       "from": "0xA1B2C3",
//       "to": "0xD4E5F6",
//       "contract": "0xTOKEN"
//     }

//     Use the above instructions and examples to ensure the LLM only returns a JSON object containing the requested information for each user query.

//     The message is: ${message}
// `
// Here’s the updated prompt with `startTimestamp` and `endTimestamp` replacing `timeframe`, along with an example showcasing these fields:

// ---

// Extract structured information from user queries about ERC20 events on EVM chains. Output a JSON object with the following keys:
// - `startTimestamp`: The earliest timestamp to consider in the analysis (e.g., "2023-10-01T00:00:00Z").
// - `endTimestamp`: The latest timestamp to consider in the analysis (e.g., "2023-10-31T23:59:59Z").
// - `from`: Sender Ethereum address (e.g., "0x123abc...").
// - `to`: Receiver Ethereum address (e.g., "0x456def...").

// Rules:
// 1. Output only the JSON object with the specified keys.
// 2. Use `null` for missing or unclear information.
// 3. Do not include additional keys or text outside the JSON object.

// Examples:

// Input:
// "Show me the total token transfers from address 0xAbCdEf1234567890AbCdEf1234567890AbCdEf12 to 0xEfGhIj4567890123EfGhIj4567890123EfGhIj45 between October 1, 2023, and October 31, 2023."

// Output:
// ```json
// {
//   "startTimestamp": "2023-10-01T00:00:00Z",
//   "endTimestamp": "2023-10-31T23:59:59Z",
//   "from": "0xAbCdEf1234567890AbCdEf1234567890AbCdEf12",
//   "to": "0xEfGhIj4567890123EfGhIj4567890123EfGhIj45"
// }
// ```

// Input:
// "I want to see all transfers from 0xAAA000111222333444555666777888999000AAA000 to 0xBBB111222333444555666777888999000BBB111 starting from November 15, 2023."

// Output:
// ```json
// {
//   "startTimestamp": "2023-11-15T00:00:00Z",
//   "endTimestamp": null,
//   "from": "0xAAA000111222333444555666777888999000AAA000",
//   "to": "0xBBB111222333444555666777888999000BBB111"
// }
// ```

// Input:
// "Hey, run an analysis of transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5 until December 31, 2023."

// Output:
// ```json
// {
//   "startTimestamp": null,
//   "endTimestamp": "2023-12-31T23:59:59Z",
//   "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
//   "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5"
// }
// ```

// Input:
// "Give me the data for transfers from 0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3 to 0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5."

// Output:
// ```json
// {
//   "startTimestamp": null,
//   "endTimestamp": null,
//   "from": "0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3",
//   "to": "0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5"
// }
// ```

// Follow these instructions and examples to ensure the output is always a JSON object with the specified keys.
