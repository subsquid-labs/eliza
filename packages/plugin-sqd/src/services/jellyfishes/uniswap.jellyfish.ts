import { Erc20, UniswapSwapParams } from "../../types";
import { BaseJellyfishService } from "./base.jellyfish";
import {
    SwapDataRequest,
    SwapDataSource,
    SwapFieldSelection,
} from "@abernatskiy/uniswapv3-pool-swaps";
import { Address } from "viem";
import { UniswapService } from "../uniswap.service";

export interface SwapEvent {
    sender: string;
    recipient: string;
    amount0: bigint;
    amount1: bigint;
    sqrtPriceX96: bigint;
    liquidity: bigint;
    tick: number;
    address: string;
}

interface BlockData {
    header: {
        timestamp: number;
        hash: string;
        number: number;
    };
    // TODO: change name to swap in the jellyfish
    transfers: SwapEvent[];
}

export interface Swap extends SwapEvent {
    address: Address;
    poolName: string;
}

export class UniswapJellyfishService extends BaseJellyfishService<
    UniswapSwapParams,
    Swap[]
> {
    private static readonly FIELDS: SwapFieldSelection = {
        block: {
            timestamp: true,
            hash: true,
            number: true,
        },
        swap: {
            sender: true,
            recipient: true,
            amount0: true,
            amount1: true,
            sqrtPriceX96: true,
            liquidity: true,
            tick: true,
        },
    };

    private uniswapService: UniswapService;

    constructor() {
        super();
        this.uniswapService = new UniswapService();
    }

    public async fetchData(params: UniswapSwapParams): Promise<Swap[]> {
        const dataRequest: SwapDataRequest = {
            swaps: [
                {
                    address: [params.poolAddress],
                },
            ],
        };

        const poolTokens = await this.uniswapService.getPoolTokens(
            params.poolAddress as Address
        );

        const stream = this.getDataSource(params, dataRequest)
            .getBlockStream(
                {
                    from: params.startBlock,
                    to: params.endBlock,
                },
                true
            )
            .pipeThrough(
                new TransformStream<BlockData[], Swap[]>({
                    transform: async (blocks, controller) => {
                        await Promise.all(
                            blocks
                                .filter(this.filterBlock)
                                .map(async (block) => {
                                    controller.enqueue(
                                        await this.parseSwaps(block, poolTokens)
                                    );
                                })
                        );
                    },
                })
            );

        const processedBlocks: Swap[] = [];

        // @ts-ignore
        for await (const data of stream) {
            processedBlocks.push(...data);
        }

        return processedBlocks;
    }

    private parseSwaps(
        block: BlockData,
        poolTokens: { token0: Erc20 | null; token1: Erc20 | null }
    ): Swap[] {
        const swaps = block.transfers.map((swap) => ({
            ...swap,
            address: swap.address as Address,
            poolName: `${poolTokens.token0?.symbol}/${poolTokens.token1?.symbol}`,
        }));

        return swaps;
    }

    private filterBlock(block: BlockData): boolean {
        return block.transfers?.length != 0;
    }

    private getDataSource(
        params: UniswapSwapParams,
        dataRequest: SwapDataRequest
    ): SwapDataSource<SwapFieldSelection> {
        return new SwapDataSource({
            portal: this.portalClient,
            query: {
                fields: UniswapJellyfishService.FIELDS,
                requests: [
                    {
                        range: {
                            from: params.startBlock,
                            to: params.endBlock,
                        },
                        request: dataRequest,
                    },
                ],
            },
        });
    }
}
