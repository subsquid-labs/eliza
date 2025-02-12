import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    elizaLogger,
} from "@elizaos/core";
import { UniswapSwapParams, UniswapSwapParamsSchema } from "../types";
import { Swap, UniswapJellyfishService } from "../services";
import { getAddress } from "viem";
import { getConfigParams } from "../utils";

/**
 * Provider that retrieves Uniswap swap data based on runtime settings
 */
class UniswapProvider implements Provider {
    public async get(
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string> {
        try {
            const queryParams = await this.getParams(runtime);

            // Check if all parameters are null/undefined
            if (
                !queryParams.startBlock &&
                !queryParams.endBlock &&
                !queryParams.poolAddress
            ) {
                elizaLogger.debug(
                    "[Uniswap Swaps Provider]: Skipping execution - no parameters were set"
                );
                return null;
            }

            const validatedParams = this.validateQueryParams(queryParams);
            const { portalUrl, rpcUrl } = getConfigParams(runtime);

            elizaLogger.debug("Uniswap Query params", validatedParams);

            const swaps = await new UniswapJellyfishService(
                portalUrl,
                rpcUrl
            ).fetchData(validatedParams);

            return this.formatOutput(swaps, validatedParams);
        } catch (error) {
            elizaLogger.debug(
                "[Uniswap Swaps Provider]: Found error while parsing parameters",
                error
            );
        }
    }

    private async getParams(
        runtime: IAgentRuntime
    ): Promise<UniswapSwapParams> {
        try {
            const startBlock = runtime.getSetting("SQD_UNISWAP_START_BLOCK");
            const endBlock = runtime.getSetting("SQD_UNISWAP_END_BLOCK");
            const config: UniswapSwapParams = {
                startBlock: startBlock ? parseInt(startBlock) : null,
                endBlock: endBlock ? parseInt(endBlock) : null,
                poolAddress: runtime.getSetting("SQD_UNISWAP_POOL_ADDRESS"),
            };
            return UniswapSwapParamsSchema.parse(config);
        } catch (error) {
            elizaLogger.debug(
                "[Uniswap Swaps Provider]: Validation error",
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
        else queryParams.poolAddress = null;

        return queryParams;
    }

    private formatOutput(swaps: Swap[], params: UniswapSwapParams) {
        const header =
            "UNISWAP SWAPS\n" +
            `Swaps for pool ${params.poolAddress || "any"} between blocks ${
                params.startBlock || "any"
            } and ${params.endBlock || "any"}\n\n`;

        if (swaps.length === 0) {
            return header + "No swaps found for the given parameters.";
        }

        const formattedSwaps = swaps.map((swap, index) => {
            const lines = [
                `- Swap #${index + 1}:`,
                `  Pool: ${swap.poolName}`,
                `  Liquidity: ${swap.liquidity}`,
                `  SqrtPriceX96: ${swap.sqrtPriceX96}`,
                `  Amount0: ${swap.amount0}`,
                `  Amount1: ${swap.amount1}`,
                `  Sender: ${swap.sender}`,
                `  Recipient: ${swap.recipient}`,
                `  Tick: ${swap.tick}`,
            ];
            return lines.join("\n");
        });

        return header + formattedSwaps.join("\n\n");
    }
}

export const uniswapProvider = new UniswapProvider();
