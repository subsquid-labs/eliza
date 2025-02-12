import { type Action, elizaLogger } from "@elizaos/core";
import type {
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    Content,
    Media,
} from "@elizaos/core";
import { getUniswapExtractionPrompt } from "../../utils/uniswap-extraction-prompt";
import { getAddress } from "viem";
import { UniswapSwapParams, UniswapSwapParamsSchema } from "../../types";
import { Swap, UniswapJellyfishService } from "../../services";
import { generateObject, ModelClass } from "@elizaos/core";
import { uniswapExamples } from "./examples";
import { getConfigParams, handleFileOutput } from "../../utils";

interface GetUniswapSwapsContent extends Content {
    text: string;
    params?: UniswapSwapParams;
    success?: boolean;
    attachments?: Media[];
    data?: {
        swaps: Swap[];
        error?: string;
    };
}

// Find the swap events of the pool 0xC6962004f452bE9203591991D15f6b388e09E8D0 between 290_000_000 and 290_010_000
export class GetUniswapSwapsAction implements Action {
    public name = "GET_UNISWAP_SWAPS";
    public similes = [
        "FETCH_UNISWAP_SWAPS",
        "LIST_UNISWAP_SWAPS",
        "QUERY_UNISWAP_SWAPS",
    ];
    public description =
        "Retrieve Uniswap swap data based on specified parameters";
    public examples = uniswapExamples;

    public async validate(
        _runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> {
        try {
            const content = message.content as GetUniswapSwapsContent;
            const extractionPrompt = getUniswapExtractionPrompt(content.text);

            const { object } = (await generateObject({
                runtime: _runtime,
                context: extractionPrompt,
                modelClass: ModelClass.SMALL,
                schema: UniswapSwapParamsSchema,
            })) as { object: UniswapSwapParams };

            // Store the extracted params in the content for the handler
            content.params = object;

            return true;
        } catch (error) {
            elizaLogger.debug(
                "[GET_UNISWAP_SWAPS] No Uniswap swap parameters identified in the current query"
            );
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
            const messageContent = message.content as GetUniswapSwapsContent;
            const queryParams = this.validateQueryParams(
                messageContent.params!
            );

            elizaLogger.debug("Uniswap Query params", queryParams);

            const { portalUrl, rpcUrl } = getConfigParams(_runtime);
            const swaps = await new UniswapJellyfishService(
                portalUrl,
                rpcUrl
            ).fetchData(queryParams);

            if (callback) {
                callback({
                    text: queryParams.fileFormat
                        ? await this.handleFileOutput(
                              swaps,
                              queryParams.fileFormat
                          )
                        : this.formatOutput(swaps, queryParams),
                    success: true,
                    params: queryParams,
                    data: {
                        swaps,
                    },
                } as GetUniswapSwapsContent);
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in GET_UNISWAP_SWAPS handler", {
                error: error instanceof Error ? error.message : String(error),
            });

            if (callback) {
                callback({
                    text: `Error retrieving Uniswap swaps: ${
                        error instanceof Error ? error.message : String(error)
                    }`,
                    success: false,
                    data: {
                        swaps: [],
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                } as GetUniswapSwapsContent);
            }

            return false;
        }
    }

    private async handleFileOutput(
        swaps: Swap[],
        fileFormat: "json" | "csv" | "parquet"
    ): Promise<string> {
        const filePath = await handleFileOutput(
            swaps,
            "uniswap-swaps",
            fileFormat
        );
        return `Your Uniswap swaps data has been saved to: ${filePath}`;
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

    private formatOutput(swaps: Swap[], params: UniswapSwapParams): string {
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
                `  Transaction Hash: ${swap.transactionHash}`,
            ];
            return lines.join("\n");
        });

        return header + formattedSwaps.join("\n\n");
    }
}

export const getUniswapSwapsAction = new GetUniswapSwapsAction();
