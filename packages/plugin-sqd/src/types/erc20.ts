import { z } from "zod";

export const Erc20TransferParamsSchema = z.object({
    startTimestamp: z.string().nullable(),
    endTimestamp: z.string().nullable(),
    from: z.string().nullable(),
    to: z.string().nullable(),
});

export type Erc20TransferParams = z.infer<typeof Erc20TransferParamsSchema>;
