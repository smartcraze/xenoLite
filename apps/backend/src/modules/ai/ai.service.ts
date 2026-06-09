import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { analyticsService } from "../analytics/analytics.service";

import {
  aiInsightsOutputSchema,
  aiMessageOutputSchema,
  aiSegmentOutputSchema,
  type MessageRequestInput,
  type SegmentRequestInput,
} from "./ai.dto";
import { SYSTEM_PROMPTS, USER_PROMPTS } from "./prompt";

const model = openai("gpt-4o-mini");

export const aiService = {
  async generateSegment(input: SegmentRequestInput) {
    try {
      const result = await generateText({
        model,
        output: Output.object({
          schema: aiSegmentOutputSchema,
        }),
        system: SYSTEM_PROMPTS.SEGMENT,
        prompt: USER_PROMPTS.segment(input.prompt),
        temperature: 0.2,
      });

      return result.output;
    } catch (error) {
      console.error("AI segment generation failed:", error);
      throw new Error("Failed to generate segment");
    }
  },

  async generateMessage(input: MessageRequestInput) {
    try {
      const result = await generateText({
        model,
        output: Output.object({
          schema: aiMessageOutputSchema,
        }),
        system: SYSTEM_PROMPTS.MESSAGE,
        prompt: USER_PROMPTS.message(input.prompt),
        temperature: 0.7,
      });

      return result.output;
    } catch (error) {
      console.error("AI message generation failed:", error);
      throw new Error("Failed to generate message");
    }
  },

  async generateInsights(campaignId: string, prompt?: string) {
    try {
      const analytics = await analyticsService.getCampaignAnalytics(campaignId);

      const result = await generateText({
        model,
        output: Output.object({
          schema: aiInsightsOutputSchema,
        }),
        system: SYSTEM_PROMPTS.INSIGHTS,
        prompt: USER_PROMPTS.insights(
          JSON.stringify(analytics, null, 2),
          prompt,
        ),
        temperature: 0.3,
      });

      return result.output;
    } catch (error) {
      console.error("AI insights generation failed:", error);
      throw new Error("Failed to generate insights");
    }
  },
};
