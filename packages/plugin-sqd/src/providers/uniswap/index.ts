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
import { UniswapSwapParams, UniswapSwapParamsSchema } from "../../types";
import { Swap, UniswapJellyfishService } from "../../services";
import { getAddress } from "viem";

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

            elizaLogger.debug("ERC20 Query params", queryParams);

            const swaps = await new UniswapJellyfishService().fetchData(
                queryParams
            );

            return this.formatOutput(swaps);
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
        if (queryParams.startBlock)
            queryParams.startBlock = Number(queryParams.startBlock);
        if (queryParams.endBlock)
            queryParams.endBlock = Number(queryParams.endBlock);

        if (queryParams.poolAddress)
            queryParams.poolAddress = getAddress(
                queryParams.poolAddress
            ).toLowerCase();

        return queryParams;
    }

    private formatOutput(swaps: Swap[]) {
        return (
            "UNISWAP SWAPS" +
            "\n" +
            "```json" +
            "\n" +
            JSON.stringify(swaps) +
            "\n" +
            "```"
        );
    }
}

export const uniswapProvider = new UniswapProvider();
