import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    generateObject,
    ModelClass,
    elizaLogger,
} from "@elizaos/core";
import { getErc20ExtractionPrompt } from "./extraction-prompt";
import { getAddress } from "viem";
import { Erc20TransferParams, Erc20TransferParamsSchema } from "../../types";
import { Erc20JellyfishService, Erc20Transfer } from "../../services";

/**
 * Provider that retrieves ERC20 transfer data based on user prompt
 */
class Erc20Provider implements Provider {
    public async get(
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State
    ): Promise<string> {
        const latestMessage = state.recentMessagesData.at(-1).content.text;
        const extractionPrompt = getErc20ExtractionPrompt(latestMessage);

        try {
            // Casting object to Erc20TransferParams to get the type since the generateObject
            // doesn't use the schema to infer the type and returns the unknown for the object
            const { object } = (await generateObject({
                runtime,
                context: extractionPrompt,
                modelClass: ModelClass.SMALL,
                schema: Erc20TransferParamsSchema,
            })) as { object: Erc20TransferParams };

            const queryParams = this.validateQueryParams(object);

            elizaLogger.debug("ERC20 Query params", queryParams);

            const transfers = await new Erc20JellyfishService().fetchData(
                queryParams
            );

            return this.formatOutput(transfers);
        } catch (error) {
            elizaLogger.debug(
                "[ERC20 Transfer Provider]: Found error while parsing user prompt",
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

        if (queryParams.startBlock)
            queryParams.startBlock = queryParams.startBlock;
        else queryParams.startBlock = null;

        if (queryParams.endBlock) queryParams.endBlock = queryParams.endBlock;
        else queryParams.endBlock = null;

        if (queryParams.contractAddress)
            queryParams.contractAddress = getAddress(
                queryParams.contractAddress
            ).toLowerCase();
        else queryParams.contractAddress = null;

        return queryParams;
    }

    private formatOutput(transfers: Erc20Transfer[]) {
        return (
            "ERC20 TRANSFERS" +
            "\n" +
            "```json" +
            "\n" +
            JSON.stringify(transfers) +
            "\n" +
            "```"
        );
    }
}

export const erc20Provider = new Erc20Provider();
