import { z } from "zod";

export const UniswapSwapParamsSchema = z.object({
    startTimestamp: z.string().nullable(),
    endTimestamp: z.string().nullable(),
});

export type UniswapSwapParams = z.infer<typeof UniswapSwapParamsSchema>;
