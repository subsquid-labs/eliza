import { describe, it, expect } from "vitest";
import { jsonToCsv, jsonToParquet } from "../utils/data-converters";

describe("Data Converters", () => {
    const testData = [
        {
            from: "0x641c00a822e8b671738d32a431a4fb6074e5c79d",
            to: "0x5e325eda8064b456f4781070c0738d849c824258",
            value: 73795365n,
            address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            blockTimestamp: 1735517189,
            blockNumber: 290000000,
            transactionHash:
                "0x5bdbad40544adaf4ba3fa84bef6e9baf75f7411a8dec4574a819392bffef5b3a",
            symbol: "USDT0",
            decimals: 6,
        },
        {
            from: "0x5e325eda8064b456f4781070c0738d849c824258",
            to: "0x89f30783108e2f9191db4a44ae2a516327c99575",
            value: 184488n,
            address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            blockTimestamp: 1735517189,
            blockNumber: 290000000,
            transactionHash:
                "0x5bdbad40544adaf4ba3fa84bef6e9baf75f7411a8dec4574a819392bffef5b3a",
            symbol: "USDT0",
            decimals: 6,
        },
        {
            from: "0x5e325eda8064b456f4781070c0738d849c824258",
            to: "0xde185f44bdeac871e363b961eaabfc8a52a04c1f",
            value: 73610877n,
            address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            blockTimestamp: 1735517189,
            blockNumber: 290000000,
            transactionHash:
                "0x5bdbad40544adaf4ba3fa84bef6e9baf75f7411a8dec4574a819392bffef5b3a",
            symbol: "USDT0",
            decimals: 6,
        },
        {
            from: "0xeacd85dd18604f99bc664ee51e4c4377b703ddb8",
            to: "0xeb0932dac0b8b4739c57deb2f944ce46a44eb7ab",
            value: 7346086n,
            address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
            blockTimestamp: 1735517191,
            blockNumber: 290000009,
            transactionHash:
                "0xdbf1d8bbfe22c0344dc4586034c86f01a2d37213574f3195259c0ca9dcd5c790",
            symbol: "USDT0",
            decimals: 6,
        },
    ];

    describe("jsonToCsv", () => {
        it("should convert JSON array to CSV string with headers", () => {
            const csv = jsonToCsv(testData);
            const lines = csv.trim().split("\n");

            // Check headers
            expect(lines[0]).toBe(
                '"from","to","value","address","blockTimestamp","blockNumber","transactionHash","symbol","decimals"'
            );

            // Check first data row
            expect(lines[1]).toBe(
                '"0x641c00a822e8b671738d32a431a4fb6074e5c79d","0x5e325eda8064b456f4781070c0738d849c824258",73795365,"0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",1735517189,290000000,"0x5bdbad40544adaf4ba3fa84bef6e9baf75f7411a8dec4574a819392bffef5b3a","USDT0",6'
            );
        });

        it("should return empty string for empty array", () => {
            const csv = jsonToCsv([]);
            expect(csv).toBe("");
        });

        it("should handle objects with missing fields", () => {
            const irregularData = [
                { from: "0x123", value: 1000n, symbol: "USDT0" },
                { to: "0x456", blockNumber: 123, decimals: 6 },
                { from: "0x789", to: "0xabc", transactionHash: "0x123..." },
            ];

            const csv = jsonToCsv(irregularData);
            const lines = csv.trim().split("\n");

            expect(lines[0]).toContain("from");
            expect(lines[0]).toContain("value");
            expect(lines[0]).toContain("symbol");
            expect(lines[1]).toContain("0x123");
            expect(lines[1]).toContain("1000");
        });
    });

    describe("jsonToParquet", () => {
        it.only("should convert JSON array to Parquet buffer", async () => {
            const buffer = await jsonToParquet(testData);

            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.length).toBeGreaterThan(0);
        });

        it("should return empty buffer for empty array", async () => {
            const buffer = await jsonToParquet([]);

            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.length).toBe(0);
        });

        it("should handle different data types", async () => {
            const mixedData = [
                {
                    from: "0x123",
                    value: 1000000n,
                    blockNumber: 123456,
                    blockTimestamp: 1735517189,
                    isValid: true,
                    extraProp: "extra",
                },
            ];

            const buffer = await jsonToParquet(mixedData);
            expect(buffer).toBeInstanceOf(Buffer);
            expect(buffer.length).toBeGreaterThan(0);
        });

        it("should throw error for invalid input", async () => {
            const invalidData = [{ hash: Symbol() }]; // Symbol is not serializable

            await expect(jsonToParquet(invalidData)).rejects.toThrow();
        });
    });
});
