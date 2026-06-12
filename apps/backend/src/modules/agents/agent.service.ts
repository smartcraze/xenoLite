import { openai } from "@ai-sdk/openai";
import { Output, ToolLoopAgent } from "ai";
import type { Response } from "express";
import { z } from "zod";
import {
  CAMPAIGN_PROMPTS,
  COMPAIGN_SUGGESTION_PROMPTS,
  generateMessagePrompt,
  MESSAGE_COPY_PROMPT,
} from "./prompts";
import * as tools from "./tools";

const model = openai("gpt-4o-mini");

export const campaignAgent = new ToolLoopAgent({
  model,
  instructions: CAMPAIGN_PROMPTS,
  tools: {
    countAudience: tools.countAudience,
    getAudienceSample: tools.getAudienceSample,
    createDraftCampaign: tools.createDraftCampaign,
    sendCampaign: tools.sendCampaign,
    getCampaignPerformance: tools.getCampaignPerformance,
  },
});

export const suggestionsAgent = new ToolLoopAgent({
  model,
  instructions: COMPAIGN_SUGGESTION_PROMPTS,
  output: Output.object({
    schema: z.object({
      suggestions: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          prompt: z
            .string()
            .describe(
              "A natural language prompt that can be forwarded to the chatCampaignBuilder agent",
            ),
        }),
      ),
    }),
  }),
});

export const messageCopyAgent = new ToolLoopAgent({
  model,
  instructions: MESSAGE_COPY_PROMPT,
  output: Output.object({
    schema: z.object({
      copy: z.string().describe("The finalized marketing message body"),
      rationale: z.string().describe("Explanation of why this copy works"),
      suggestedChannel: z.enum(["WHATSAPP", "SMS", "EMAIL"]),
    }),
  }),
});

export const agentService = {
  /**
   * Execute the campaign agent loop and stream the output (text parts + tool events) to Express response
   */
  async chatCampaignBuilderStream(prompt: string, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await campaignAgent.stream({ prompt });

    for await (const part of result.fullStream) {
      res.write(`data: ${JSON.stringify(part)}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  },

  /**
   * Execute the campaign agent loop synchronously and return the final text + steps
   */
  async chatCampaignBuilder(prompt: string) {
    const result = await campaignAgent.generate({ prompt });

    return {
      text: result.text,
      steps: result.steps ?? [],
    };
  },

  /**
   * Generate 3 high-converting audience suggestions
   */
  async getSegmentSuggestions() {
    const result = await suggestionsAgent.generate({
      prompt: "Provide 3 dashboard segment suggestions.",
    });

    return result.output.suggestions;
  },

  /**
   * Generate custom message copy with tone and urgency
   */
  async generateMessage(context: string, tone: string, urgency: string) {
    const result = await messageCopyAgent.generate({
      prompt: generateMessagePrompt(context, tone, urgency),
    });

    return result.output;
  },
};
