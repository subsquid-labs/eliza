import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    generateObject,
    ModelClass,
    elizaLogger,
} from "@elizaos/core";
import { getUniswapExtractionPrompt } from "./extraction-prompt";
import { isoToUnixEpoch } from "../../utils";
import { UniswapSwapParams, UniswapSwapParamsSchema } from "../../types";
import { JellyfishService } from "../../services";

/**
 * Provider that retrieves Uniswap swap data based on user prompt
 */
class UniswapProvider implements Provider {
    public async get(
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State
    ): Promise<string> {
        const latestMessage = state.recentMessagesData.at(-1).content.text;
        const extractionPrompt = getUniswapExtractionPrompt(latestMessage);

        try {
            // Casting object to UniswapSwapParams to get the type since the generateObject
            // doesn't use the schema to infer the type and returns the unknown for the object
            const { object } = (await generateObject({
                runtime,
                context: extractionPrompt,
                modelClass: ModelClass.SMALL,
                schema: UniswapSwapParamsSchema,
            })) as { object: UniswapSwapParams };

            const queryParams = this.validateQueryParams(object);

            elizaLogger.info("UNISWAP EXTRACTED PARAMS: ", queryParams);

            return JellyfishService.fetchUniswapSwaps(queryParams);
        } catch (error) {
            elizaLogger.log(
                "[Uniswap Swaps Provider]: Unable to extract user data from prompt. Skipping"
            );
            elizaLogger.debug(
                "[Uniswap Swaps Provider]: Found error while parsing user prompt",
                error
            );
        }
    }

    private validateQueryParams(
        queryParams: UniswapSwapParams
    ): UniswapSwapParams {
        if (queryParams.startTimestamp)
            queryParams.startTimestamp = isoToUnixEpoch(
                queryParams.startTimestamp
            );
        if (queryParams.endTimestamp)
            queryParams.endTimestamp = isoToUnixEpoch(queryParams.endTimestamp);
        return queryParams;
    }
}

export const uniswapProvider = new UniswapProvider();
