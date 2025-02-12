import { arbitrum } from "viem/chains";
import { Erc20 } from "../types";
import { DefillamaService } from "./defillama.service";
import { Address, createPublicClient, getAddress, http } from "viem";
import uniswapV3PoolAbi from "../abis/uniswap-v3-pool.json";
import { Erc20Service } from "./erc20.service";

/**
 * Service to fetch data from a Uniswap V3 pool
 */
export class UniswapService {
    private erc20Service: Erc20Service;

    constructor(private rpcUrl: string) {
        this.erc20Service = new Erc20Service(rpcUrl, new DefillamaService());
    }

    public async getPoolTokens(
        poolAddress: Address
    ): Promise<{ token0: Erc20 | null; token1: Erc20 | null }> {
        const [token0Result, token1Result] = await this.client.multicall({
            // @ts-ignore: throwing the error "Type instantiation is excessively deep and possibly infinite"
            contracts: [
                this.getPoolTokenParams(poolAddress, "token0"),
                this.getPoolTokenParams(poolAddress, "token1"),
            ],
        });

        const token0 =
            token0Result.status === "success"
                ? getAddress(token0Result.result as string)
                : null;
        const token1 =
            token1Result.status === "success"
                ? getAddress(token1Result.result as string)
                : null;

        const tokenData = await this.erc20Service.getErc20Info([
            ...(token0 ? [{ address: token0, chain: arbitrum }] : []),
            ...(token1 ? [{ address: token1, chain: arbitrum }] : []),
        ]);

        return {
            token0: token0
                ? {
                      ...tokenData.get(token0),
                      address: token0,
                      chain: arbitrum,
                  }
                : null,
            token1: token1
                ? {
                      ...tokenData.get(token1),
                      address: token1,
                      chain: arbitrum,
                  }
                : null,
        };
    }

    private get client() {
        return createPublicClient({
            // TODO: once we include support for other chains, we should make this dynamic
            chain: arbitrum,
            transport: http(this.rpcUrl),
        });
    }

    private getPoolTokenParams(address: Address, functionName: string) {
        return {
            abi: uniswapV3PoolAbi,
            functionName,
            address,
        };
    }
}
