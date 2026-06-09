import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { env } from "../../lib/env";
import { analyticsService } from "../analytics/analytics.service";
import {
    aiInsightsOutputSchema,
    aiMessageOutputSchema,
    aiSegmentOutputSchema,
    type MessageRequestInput,
    type SegmentRequestInput,
} from "./ai.dto";

export const aiService = {
    async generateSegment(input: SegmentRequestInput) {
        const result = await generateObject({
            model: openai("gpt-4o-mini", { apiKey: env.OPENAI_API_KEY }),
            schema: aiSegmentOutputSchema,
            prompt: `
            You are an AI targeting assistant for a CRM platform. 
            Based on the user's plain text prompt, extract the logical DTO filters to query our database.
            
            Prompt: "${input.prompt}"
            `,
        });

        return result.object;
    },

    async generateMessage(input: MessageRequestInput) {
        const result = await generateObject({
            model: openai("gpt-4o-mini", { apiKey: env.OPENAI_API_KEY }),
            schema: aiMessageOutputSchema,
            prompt: `
            You are an expert marketing copywriter for a D2C CRM platform.
            Write a high-converting, personalized messaging body based on the following instruction.
            Keep it short and engaging.
            
            Prompt: "${input.prompt}"
            `,
        });

        return result.object;
    },

    async generateInsights(campaignId: string, prompt?: string) {
        // Fetch raw metrics to feed the LLM
        const analytics = await analyticsService.getCampaignAnalytics(campaignId);

        const result = await generateObject({
            model: openai("gpt-4o-mini", { apiKey: env.OPENAI_API_KEY }),
            schema: aiInsightsOutputSchema,
            prompt: `
            You are an expert CRM data analyst. Analyze these campaign metrics and return structured insights.
            
            Campaign metrics:
            ${JSON.stringify(analytics, null, 2)}
            
            User's extra context/question: ${prompt || "Analyze the performance."}
            `,
        });

        return result.object;
    },
};
