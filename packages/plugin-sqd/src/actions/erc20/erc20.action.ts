import { type Action, elizaLogger } from "@elizaos/core";
import type {
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    Content,
    ActionExample,
    Media,
} from "@elizaos/core";
import { getErc20ExtractionPrompt } from "../../utils/erc20-extraction-prompt";
import { getAddress } from "viem";
import { Erc20TransferParams, erc20TransferParamsSchema } from "../../types";
import { Erc20JellyfishService, Erc20Transfer } from "../../services";
import { generateObject, ModelClass } from "@elizaos/core";
import { erc20Examples } from "./examples";
import { saveJsonFile } from "../../utils";

interface GetErc20TransfersContent extends Content {
    text: string;
    params?: Erc20TransferParams;
    success?: boolean;
    attachments?: Media[];
    data?: {
        transfers: Erc20Transfer[];
        error?: string;
    };
}

export class GetErc20TransfersAction implements Action {
    public name = "GET_ERC20_TRANSFERS";
    public similes = [
        "FETCH_ERC20_TRANSFERS",
        "LIST_TOKEN_TRANSFERS",
        "QUERY_TOKEN_TRANSFERS",
    ];
    public description =
        "Retrieve ERC20 transfer data based on specified parameters";
    public examples = erc20Examples;

    public async validate(
        _runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> {
        try {
            const content = message.content as GetErc20TransfersContent;
            const extractionPrompt = getErc20ExtractionPrompt(content.text);

            const { object } = (await generateObject({
                runtime: _runtime,
                context: extractionPrompt,
                modelClass: ModelClass.SMALL,
                schema: erc20TransferParamsSchema,
            })) as { object: Erc20TransferParams };

            // Store the extracted params in the content for the handler
            content.params = object;

            return true;
        } catch (error) {
            elizaLogger.error("Validation failed for GET_ERC20_TRANSFERS", {
                error: error instanceof Error ? error.message : String(error),
            });
            return false;
        }
    }

    public async handler(
        _runtime: IAgentRuntime,
        message: Memory,
        _state?: State,
        _options: { [key: string]: unknown } = {},
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const messageContent = message.content as GetErc20TransfersContent;
            const queryParams = this.validateQueryParams(
                messageContent.params!
            );

            elizaLogger.debug("ERC20 Query params", queryParams);

            const transfers = await new Erc20JellyfishService().fetchData(
                queryParams
            );

            if (callback) {
                callback({
                    text: queryParams.fileFormat
                        ? this.handleFileOutput(transfers)
                        : this.formatOutput(transfers, queryParams),
                    success: true,
                    params: queryParams,
                    data: {
                        transfers,
                    },
                } as GetErc20TransfersContent);
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in GET_ERC20_TRANSFERS handler", {
                error: error instanceof Error ? error.message : String(error),
            });

            if (callback) {
                callback({
                    text: `Error retrieving ERC20 transfers: ${
                        error instanceof Error ? error.message : String(error)
                    }`,
                    success: false,
                    data: {
                        transfers: [],
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                } as GetErc20TransfersContent);
            }

            return false;
        }
    }

    private handleFileOutput(transfers: Erc20Transfer[]): string {
        const filePath = saveJsonFile(transfers, "erc20transfer");
        return `Your ERC20 transfers data has been saved to: ${filePath}`;
    }

    private validateQueryParams(
        queryParams: Erc20TransferParams
    ): Erc20TransferParams {
        return {
            ...queryParams,
            from: queryParams.from
                ? getAddress(queryParams.from).toLowerCase()
                : null,
            to: queryParams.to
                ? getAddress(queryParams.to).toLowerCase()
                : null,
            contractAddress: queryParams.contractAddress
                ? getAddress(queryParams.contractAddress).toLowerCase()
                : null,
        };
    }

    private formatOutput(
        transfers: Erc20Transfer[],
        params: Erc20TransferParams
    ): string {
        const header =
            "ERC20 TRANSFERS\n" +
            `Transfers from ${params.from || "any"} to ${
                params.to || "any"
            } for contract ${params.contractAddress || "any"} between blocks ${
                params.startBlock || "any"
            } and ${params.endBlock || "any"}\n\n`;

        if (transfers.length === 0) {
            return header + "No transfers found for the given parameters.";
        }

        const formattedTransfers = transfers.map((transfer, index) => {
            const lines = [
                `- Transfer #${index + 1}:`,
                `  From: ${transfer.from}`,
                `  To: ${transfer.to}`,
                `  Amount: ${transfer.value}`,
                `  Contract: ${transfer.address}`,
                `  Block: ${transfer.blockNumber}`,
                `  Transaction Hash: ${transfer.transactionHash}`,
            ];
            return lines.join("\n");
        });

        return header + formattedTransfers.join("\n\n");
    }
}

export const getErc20TransfersAction = new GetErc20TransfersAction();
