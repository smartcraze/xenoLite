import { z } from "zod";

export const createCampaignSchema = z.object({
    name: z.string().min(1),
    message: z.string().min(1),
    channel: z.string().min(1),
    audienceQuery: z.string().optional(), // Expected to be stringified JSON
});

export const campaignsQuerySchema = z.object({
    status: z.enum(["DRAFT", "RUNNING", "COMPLETED", "FAILED"]).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const campaignIdParamSchema = z.object({
    id: z.string().cuid(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CampaignsQueryInput = z.infer<typeof campaignsQuerySchema>;
