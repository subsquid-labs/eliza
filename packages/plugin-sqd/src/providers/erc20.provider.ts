import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    elizaLogger,
} from "@elizaos/core";
import { getAddress } from "viem";
import { Erc20TransferParams, erc20TransferParamsSchema } from "../types";
import { Erc20JellyfishService, Erc20Transfer } from "../services";
import { getConfigParams } from "../utils";

/**
 * Provider that retrieves ERC20 transfer data based on environment variables
 */
class Erc20Provider implements Provider {
    public async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string> {
        try {
            const queryParams = this.getExtractionParams(runtime);

            // Check if all parameters are null/undefined
            if (
                !queryParams.startBlock &&
                !queryParams.endBlock &&
                !queryParams.from &&
                !queryParams.to &&
                !queryParams.contractAddress
            ) {
                elizaLogger.debug(
                    "[ERC20 Transfer Provider]: Skipping execution - no parameters were set"
                );
                return null;
            }

            const { portalUrl, rpcUrl } = getConfigParams(runtime);
            const validatedParams = this.validateQueryParams(queryParams);

            elizaLogger.debug("ERC20 Query params", validatedParams);

            const transfers = await new Erc20JellyfishService(
                portalUrl,
                rpcUrl
            ).fetchData(validatedParams);

            return this.formatOutput(transfers, validatedParams);
        } catch (error) {
            elizaLogger.debug(
                "[ERC20 Transfer Provider]: Found error while fetching data",
                error
            );
        }
    }

    private getExtractionParams(runtime: IAgentRuntime): Erc20TransferParams {
        try {
            const startBlock = runtime.getSetting("SQD_ERC20_START_BLOCK");
            const endBlock = runtime.getSetting("SQD_ERC20_END_BLOCK");
            const config: Erc20TransferParams = {
                from: runtime.getSetting("SQD_ERC20_FROM_ADDRESS"),
                to: runtime.getSetting("SQD_ERC20_TO_ADDRESS"),
                startBlock: startBlock ? parseInt(startBlock) : null,
                endBlock: endBlock ? parseInt(endBlock) : null,
                contractAddress: runtime.getSetting(
                    "SQD_ERC20_CONTRACT_ADDRESS"
                ),
            };
            return erc20TransferParamsSchema.parse(config);
        } catch (error) {
            elizaLogger.debug(
                "[ERC20 Transfer Provider]: Validation error",
                error
            );
        }
    }

    private validateQueryParams(
        queryParams: Erc20TransferParams
    ): Erc20TransferParams {
        if (queryParams.from)
            queryParams.from = getAddress(queryParams.from).toLowerCase();
        else queryParams.from = null;

        if (queryParams.to)
            queryParams.to = getAddress(queryParams.to).toLowerCase();
        else queryParams.to = null;

        if (queryParams.contractAddress)
            queryParams.contractAddress = getAddress(
                queryParams.contractAddress
            ).toLowerCase();
        else queryParams.contractAddress = null;

        return queryParams;
    }

    private formatOutput(
        transfers: Erc20Transfer[],
        params: Erc20TransferParams
    ): string {
        const header =
            "ERC20 TRANSFERS\n" +
            `Transfers from ${params.from || "any"} to ${params.to || "any"} ` +
            `for contract ${params.contractAddress || "any"} between blocks ` +
            `${params.startBlock || "any"} and ${params.endBlock || "any"}\n\n`;

        if (transfers.length === 0) {
            return header + "No transfers found for the given parameters.";
        }

        const formattedTransfers = transfers.map((transfer, index) => {
            const lines = [
                `- Transfer #${index + 1}:`,
                `  From: ${transfer.from}`,
                `  To: ${transfer.to}`,
                `  Contract: ${transfer.address}`,
                `  Amount: ${transfer.value}`,
                `  Block: ${transfer.blockNumber}`,
                `  Transaction Hash: ${transfer.transactionHash}`,
            ];
            return lines.join("\n");
        });

        return header + formattedTransfers.join("\n\n");
    }
}

export const erc20Provider = new Erc20Provider();
