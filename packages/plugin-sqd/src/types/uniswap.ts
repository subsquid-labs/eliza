import { z } from "zod";

export const UniswapSwapParamsSchema = z.object({
    startBlock: z.number().nullable(),
    endBlock: z.number().nullable(),
    poolAddress: z.string().nullable(),
    fileFormat: z.string().nullable().optional(),
});

export type UniswapSwapParams = z.infer<typeof UniswapSwapParamsSchema>;
