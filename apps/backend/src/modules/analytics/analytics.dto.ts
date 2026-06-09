import { z } from "zod";

export const analyticsParamsSchema = z.object({
  campaignId: z.string().cuid(),
});
