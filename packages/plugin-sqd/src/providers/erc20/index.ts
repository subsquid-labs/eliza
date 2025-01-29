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
import { isoToUnixEpoch } from "../../utils";
import { Erc20TransferParams, Erc20TransferParamsSchema } from "../../types";
import { JellyfishService } from "../../services";

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

            elizaLogger.info("ERC20 EXTRACTED PARAMS: ", queryParams);

            return JellyfishService.fetchErc20Transfers(queryParams);
        } catch (error) {
            elizaLogger.log(
                "[ERC20 Transfer Provider]: Unable to extract user data from prompt. Skipping"
            );
            elizaLogger.debug(
                "[ERC20 Transfer Provider]: Found error while parsing user prompt",
                error
            );
        }
    }

    private validateQueryParams(
        queryParams: Erc20TransferParams
    ): Erc20TransferParams {
        if (queryParams.from) queryParams.from = getAddress(queryParams.from);
        else queryParams.from = null;

        if (queryParams.to) queryParams.to = getAddress(queryParams.to);
        else queryParams.to = null;

        if (queryParams.startTimestamp)
            queryParams.startTimestamp = isoToUnixEpoch(
                queryParams.startTimestamp
            );
        else queryParams.startTimestamp = null;

        if (queryParams.endTimestamp)
            queryParams.endTimestamp = isoToUnixEpoch(queryParams.endTimestamp);
        else queryParams.endTimestamp = null;

        return queryParams;
    }
}

export const erc20Provider = new Erc20Provider();
