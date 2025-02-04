import { z } from "zod";
import { Address, Chain } from "viem";
import { Erc20MetadataMap, Erc20MetadataProvider, Account } from "../types";

const DefillamaCoinSchema = z.object({
    decimals: z.number(),
    symbol: z.string(),
    price: z.number().optional(),
    timestamp: z.number().optional(),
    confidence: z.number(),
});

const DefillamaResponseSchema = z.object({
    coins: z.record(z.string(), DefillamaCoinSchema.optional()),
});

// TODO: cache response
export class DefillamaService implements Erc20MetadataProvider {
    private static readonly BASE_URL = "https://coins.llama.fi";
    private static readonly PRICES_URL = `${DefillamaService.BASE_URL}/prices/current/`;

    public async getTokenInfoFromChain(
        chain: Chain,
        tokens: Set<Address>
    ): Promise<Erc20MetadataMap> {
        const tokenParams = Array.from(tokens).map((token) => ({
            address: token,
            chain,
        }));
        return this.getTokenInfo(tokenParams);
    }

    public async getTokenInfo(tokens: Account[]): Promise<Erc20MetadataMap> {
        try {
            const fullUrl = `${DefillamaService.PRICES_URL}${tokens
                .map((token) => `arbitrum:${token.address}`)
                .join(",")}`;
            const response = await fetch(fullUrl);
            const rawData = await response.json();
            const data = DefillamaResponseSchema.parse(rawData);
            const tokenMap: Erc20MetadataMap = new Map();

            Object.entries(data.coins).forEach(([key, value]) => {
                if (!value) return;

                const address = key.split(":")[1] as Address;
                const erc20 = {
                    symbol: value.symbol,
                    decimals: value.decimals,
                };

                tokenMap.set(address, erc20);
            });

            return tokenMap;
        } catch (error) {
            console.error("Error fetching token info from Defillama:", error);
            return new Map();
        }
    }
}
