import { Erc20TransferParams, UniswapSwapParams } from "../types";
import { PortalClient } from "@abernatskiy/portal-client";
import { HttpClient } from "@abernatskiy/http-client";
import {
    Erc20DataRequest,
    ERC20DataSource,
    Erc20FieldSelection,
} from "@abernatskiy/erc20-transfers-jellyfish";

/**
 * Service to query SQD's jellyfishes
 */
export class JellyfishService {
    public static TOKEN_ADDRESS = "0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1";
    public static FROM_BLOCK = 290_000_000;
    public static TO_BLOCK = 290_100_000;

    // NOTE: Params not being used right now. All the values are hardcoded for the sake of testing.
    public static async fetchErc20Transfers() {
        const portal = new PortalClient({
            url: "https://portal.sqd.dev/datasets/arbitrum-one",
            http: new HttpClient({
                retryAttempts: 3,
            }),
            minBytes: 1 * 1024 * 1024,
        });

        const fields: Erc20FieldSelection = {
            block: {
                timestamp: true,
                hash: true,
                number: true,
            },
            transfer: {
                from: true,
                to: true,
                value: true,
                transactionIndex: true,
            },
        };

        const dataRequest: Erc20DataRequest = {
            transfers: [
                {
                    address: [JellyfishService.TOKEN_ADDRESS],
                },
            ],
        };

        let dataSource = new ERC20DataSource({
            portal,
            query: {
                fields,
                requests: [
                    {
                        range: {
                            from: JellyfishService.FROM_BLOCK,
                            to: JellyfishService.TO_BLOCK,
                        },
                        request: dataRequest,
                    },
                ],
            },
        });

        let stream = dataSource
            .getBlockStream({ from: JellyfishService.FROM_BLOCK }, true)
            .pipeThrough(
                new TransformStream({
                    transform: (blocks, controller) => {
                        blocks
                            .filter((b: any) => b.transfers?.length != 0)
                            .forEach((b: any) => {
                                controller.enqueue(b);
                            });
                    },
                })
            );

        const processedBlocks: any[] = [];

        for await (let data of stream) {
            processedBlocks.push(data);
        }

        return processedBlocks;
    }

    public static fetchUniswapSwaps(_params: UniswapSwapParams) {
        return `
            ** Uniswap swaps **

            Pool: USDC-WETH, Input amount: 100 USDC, Ouput amount: 0.01 WETH
            Pool: USDC-WETH, Input amount: 1000 USDC, Ouput amount: 0.1 WETH
            Pool: USDC-WETH, Input amount: 10000 USDC, Ouput amount: 1 WETH
            Pool: USDC-WETH, Input amount: 100000 USDC, Ouput amount: 10 WETH
        `;
    }
}
