import { z } from "zod";

export const segmentRequestSchema = z.object({
    prompt: z.string().min(1),
});

export const messageRequestSchema = z.object({
    prompt: z.string().min(1),
});

export const insightsRequestSchema = z.object({
    prompt: z.string().optional(),
});

export const insightsParamSchema = z.object({
    campaignId: z.string().cuid(),
});

export const aiSegmentOutputSchema = z.object({
    cities: z
        .array(z.string())
        .optional()
        .describe("Array of city names mentioned to target"),
    minSpent: z
        .number()
        .optional()
        .describe(
            "Minimum spent amount to target, e.g. 1000 for users who spent > 1000",
        ),
    explanation: z
        .string()
        .describe("Explanation of why these filters were chosen"),
});

export const aiMessageOutputSchema = z.object({
    message: z
        .string()
        .describe("The localized marketing message ready to be sent"),
});

export const aiInsightsOutputSchema = z.object({
    summary: z
        .string()
        .describe("A short natural language summary of performance"),
    keyTakeaways: z
        .array(z.string())
        .describe("List of key insights from the metrics"),
    suggestedAction: z
        .string()
        .describe("What the user should do next based on performance"),
});

export type SegmentRequestInput = z.infer<typeof segmentRequestSchema>;
export type MessageRequestInput = z.infer<typeof messageRequestSchema>;
export type InsightsRequestInput = z.infer<typeof insightsRequestSchema>;
