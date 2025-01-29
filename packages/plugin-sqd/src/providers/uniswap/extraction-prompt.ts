export const getUniswapExtractionPrompt = (message: string) =>
    `
Task
Extract startTimestamp and endTimestamp (ISO 8601 format) from user queries about Uniswap activity. Output a JSON object with only these two keys.

Rules
1. Convert explicit time references (e.g., "October 1, 2023", "last week") to ISO 8601 strings (e.g., "2023-10-01T00:00:00Z").
2. Use null if a timestamp is missing, ambiguous, or not explicitly defined.
3. Ignore all other parameters (pools, tokens, events, etc.).
4. Response with an empty object if the prompt is unrelated to Uniswap

Examples

Input:
"Analyze swaps between October 1, 2023 (12:00 AM UTC) and October 31, 2023 (11:59 PM UTC)."

Output:
\`\`\`json
{
  "startTimestamp": "2023-10-01T00:00:00Z",
  "endTimestamp": "2023-10-31T23:59:59Z"
}
\`\`\`

Input:
"Give me all trades up to January 1, 2024, at 5 PM UTC."

Output:
\`\`\`json
{
  "startTimestamp": null,
  "endTimestamp": "2024-01-01T17:00:00Z"
}
\`\`\`

Input:
"Everything in the last 7 days."

Output:
\`\`\`json
{}
\`\`\`
Unclear if this is about Uniswap, returning empty object

Input:
"give me some ERC20 transfers from 0x5f2978c2af6fbd895132231bf9a9ac2c972dc25f to 0x58012c78ce5d955a8fe59792bfdadeef64d966fc"

Output:
\`\`\`json
{}
\`\`\`
ERC20 transfers are unrelated to Uniswap dataset, returning empty object

---

Notes
- ISO 8601 Format: Always use UTC (denoted by Z) unless a specific timezone is provided (e.g., "2023-10-01T12:00:00+02:00").
- Ambiguity: Phrases like "recently," "last week," or "the past month" result in null unless paired with explicit dates.
- Time Precision: Default to 00:00:00Z if only a date (no time) is provided (e.g., "2023-10-01" → "2023-10-01T00:00:00Z").

This version isolates ISO 8601 timestamp extraction for Uniswap activity, ignoring all other parameters.

The message is: ${message}
`;
