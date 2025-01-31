import { Erc20MetadataMap, Erc20TransferParams } from "../../types";
import {
    Erc20DataRequest,
    ERC20DataSource,
    Erc20FieldSelection,
} from "@abernatskiy/erc20-transfers-jellyfish";
import { Address } from "viem";
import { arbitrum } from "viem/chains";
import { BaseJellyfishService } from "./base.jellyfish";
import { DefillamaService } from "../defillama.service";
import { Erc20Service } from "../erc20.service";

interface TransferEvent {
    from: string;
    to: string;
    value: bigint;
    address: string;
}

interface BlockData {
    header: {
        number: number;
        hash: string;
        timestamp: number;
    };
    transfers: TransferEvent[];
}

export interface Erc20Transfer extends TransferEvent {
    decimals: number;
    symbol: string;
    blockTimestamp: number;
    blockNumber: number;
}

/*
 * Service to query SQD's jellyfishes
 */
export class Erc20JellyfishService extends BaseJellyfishService<
    Erc20TransferParams,
    Erc20Transfer[]
> {
    private static readonly FIELDS: Erc20FieldSelection = {
        block: {
            timestamp: true,
            hash: true,
            number: true,
        },
        transfer: {
            from: true,
            to: true,
            value: true,
            address: true,
        },
    };

    private erc20Service: Erc20Service;

    constructor() {
        super();
        this.erc20Service = new Erc20Service(new DefillamaService());
    }

    public async fetchData(
        params: Erc20TransferParams
    ): Promise<Erc20Transfer[]> {
        const dataRequest: Erc20DataRequest = {
            transfers: [
                {
                    address: params.contractAddress
                        ? [params.contractAddress]
                        : undefined,
                    from: params.from ? [params.from] : undefined,
                    to: params.to ? [params.to] : undefined,
                },
            ],
        };
        const erc20Metadata = await this.erc20Service.getErc20Info([
            { address: params.contractAddress as Address, chain: arbitrum },
        ]);

        const stream = this.getDataSource(params, dataRequest)
            .getBlockStream(
                { from: params.startBlock, to: params.endBlock },
                true
            )
            .pipeThrough(
                new TransformStream<BlockData[], Erc20Transfer[]>({
                    transform: async (blocks, controller) => {
                        await Promise.all(
                            blocks
                                .filter(this.filterBlock)
                                .map(async (block: BlockData) => {
                                    controller.enqueue(
                                        await this.parseTransfers(
                                            block,
                                            erc20Metadata
                                        )
                                    );
                                })
                        );
                    },
                })
            );

        const processedBlocks: Erc20Transfer[] = [];

        // @ts-ignore
        for await (let data of stream) {
            processedBlocks.push(data);
        }

        return processedBlocks;
    }

    private async parseTransfers(
        block: BlockData,
        erc20Metadata: Erc20MetadataMap
    ): Promise<Erc20Transfer[]> {
        return block.transfers.map((transfer) => ({
            from: transfer.from as Address,
            to: transfer.to as Address,
            value: transfer.value,
            address: transfer.address,
            blockTimestamp: block.header.timestamp,
            blockNumber: block.header.number,
            ...erc20Metadata.get(transfer.address as Address),
        }));
    }

    private filterBlock(block: BlockData): boolean {
        return block.transfers?.length != 0;
    }

    private getDataSource(
        params: Erc20TransferParams,
        dataRequest: Erc20DataRequest
    ): ERC20DataSource<Erc20FieldSelection> {
        return new ERC20DataSource({
            portal: this.portalClient,
            query: {
                fields: Erc20JellyfishService.FIELDS,
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
