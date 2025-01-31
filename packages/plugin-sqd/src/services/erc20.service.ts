import {
    Address,
    Chain,
    createPublicClient,
    erc20Abi,
    getAddress,
    http,
} from "viem";
import { DefillamaService } from "./defillama.service";
import { Erc20Metadata, Erc20MetadataMap, Account } from "../types";

import { ARBITRUM_RPC_URL } from "../config/constants";

export class Erc20Service {
    constructor(private defillamaService: DefillamaService) {}

    public async getErc20Info(tokens: Account[]): Promise<Erc20MetadataMap> {
        const defillamaResponse = await this.defillamaService.getTokenInfo(
            tokens
        );
        // Check all tokens are present
        const defillamaTokens = new Set(defillamaResponse.keys());
        const tokensSet = new Set(tokens.map((token) => token.address));
        if (defillamaTokens.size == tokensSet.size) {
            return defillamaResponse;
        }

        const missingTokens = await this.getMissingTokens(
            tokens,
            defillamaResponse
        );
        const missingTokensInfo = await this.fetchMissingTokens(missingTokens);

        return missingTokensInfo.reduce((map, token) => {
            map.set(getAddress(token.address), token);
            return map;
        }, new Map(defillamaResponse));
    }

    public async getErc20InfoFromChain(
        chain: Chain,
        tokens: Set<Address>
    ): Promise<Erc20MetadataMap> {
        const tokensInfo = await this.getErc20Info(
            Array.from(tokens).map((token) => ({
                address: token,
                chain,
            }))
        );
        return tokensInfo;
    }

    protected async getMissingTokens(
        requestedTokens: Account[],
        defillamaTokens: Erc20MetadataMap
    ): Promise<Account[]> {
        const defillamaTokensSet = new Set(defillamaTokens.keys());
        const tokensByChain: Record<number, Account[]> = requestedTokens.reduce(
            (acc, token) => {
                if (!acc[token.chain.id]) {
                    acc[token.chain.id] = [];
                }
                acc[token.chain.id].push(token);
                return acc;
            },
            {} as Record<number, Account[]>
        );

        const missingTokens = Object.values(tokensByChain).flatMap(
            (chainTokens) => {
                return chainTokens.filter(
                    (token) => !defillamaTokensSet.has(token.address)
                );
            }
        );
        return missingTokens;
    }

    protected async fetchMissingTokens(
        missingTokens: Account[]
    ): Promise<(Erc20Metadata & Account)[]> {
        const tokensByChain = missingTokens.reduce((acc, token) => {
            if (!acc[token.chain.id]) {
                acc[token.chain.id] = [];
            }
            acc[token.chain.id].push(token);
            return acc;
        }, {} as Record<number, Account[]>);

        const results: (Erc20Metadata & Account)[] = [];
        for (const chainTokens of Object.values(tokensByChain)) {
            if (chainTokens.length === 0) continue;
            const chain = chainTokens[0].chain;
            const client = this.getClient(chain);
            const multicallResults = await client.multicall({
                // @ts-ignore
                contracts: chainTokens.flatMap((token) => [
                    {
                        address: token.address,
                        abi: erc20Abi,
                        functionName: "symbol",
                    },
                    {
                        address: token.address,
                        abi: erc20Abi,
                        functionName: "decimals",
                    },
                ]),
            });

            // Process results in pairs (symbol, decimals)
            for (let i = 0; i < chainTokens.length; i++) {
                const symbolResult = multicallResults[i * 2];
                const decimalsResult = multicallResults[i * 2 + 1];
                if (
                    symbolResult.status === "success" &&
                    decimalsResult.status === "success"
                ) {
                    results.push({
                        symbol: symbolResult.result as string,
                        decimals: Number(decimalsResult.result),
                        ...chainTokens[i],
                    });
                }
            }
        }
        return results;
    }

    private getClient(chain: Chain) {
        return createPublicClient({
            chain,
            transport: http(ARBITRUM_RPC_URL),
        });
    }
}
