import { z } from "zod";
import { Address, Chain } from "viem";

export type Erc20 = Account & Erc20Metadata;

export interface Erc20Metadata {
    decimals: number;
    symbol: string;
}

export const erc20TransferParamsSchema = z.object({
    startBlock: z.number().nullable(),
    endBlock: z.number().nullable(),
    from: z.string().nullable(),
    to: z.string().nullable(),
    contractAddress: z.string().nullable(),
    fileFormat: z.enum(["json", "csv", "parquet"]).optional().nullable(),
});

export type Erc20TransferParams = z.infer<typeof erc20TransferParamsSchema>;

export interface Account {
    address: Address;
    chain: Chain;
}

export type Erc20MetadataMap = Map<Address, Erc20Metadata>;

export interface Erc20MetadataProvider {
    getTokenInfoFromChain(
        chain: Chain,
        tokens: Set<Address>
    ): Promise<Erc20MetadataMap>;

    getTokenInfo(tokens: Account[]): Promise<Erc20MetadataMap>;
}
