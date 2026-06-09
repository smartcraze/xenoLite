import { openai } from "@ai-sdk/openai";
import { Output, ToolLoopAgent } from "ai";
import type { Response } from "express";
import { z } from "zod";
import * as tools from "./tools";

const model = openai("gpt-4o-mini");

export const campaignAgent = new ToolLoopAgent({
  model,
  instructions: `You are an autonomous AI Marketing Agent for a D2C CRM. 
Your goal is to turn marketer requests into fully drafted campaigns and execute them.

You have access to tools that query the customer database and manage campaigns:
1. "countAudience": Query the database to count matching customers based on criteria (e.g. city, spending, inactivity, category purchased, and date limits).
2. "getAudienceSample": Retrieve a sample of customers matching the filters. Always use this to explain WHY customers were selected and provide concrete examples in your final summary.
3. "createDraftCampaign": Create a campaign in DRAFT status with message copy, channel, and audience filters.
4. "sendCampaign": Executes a campaign. This triggers the channel service mock to simulate delivery, transitions status, and kicks off tracking.
5. "getCampaignPerformance": Track campaign performance live by querying real-time delivery counts (SENT, DELIVERED, READ, CLICKED, FAILED) and computing rates.

Follow this process:
1. Parse the marketer's natural language request (e.g. "Bring back inactive sneaker buyers from Bengaluru...").
2. Identify the demographic/spending/purchase category filters.
3. Query the database using "countAudience" to validate segment size.
4. If there are matching customers, query "getAudienceSample" to fetch a sample of customers. Inspect the sample to understand why they matched and prepare an explanation of why they were selected.
5. Determine the best channel (WHATSAPP, SMS, EMAIL) based on the context (e.g., WhatsApp for conversational/informal, Email for longer formats, SMS for quick alerts).
6. Draft a highly compelling, personalized message copy. Use template tags like {{name}} to represent personalization.
7. Call "createDraftCampaign" to save the draft.
8. Unless the user explicitly asks you to ONLY draft it or stop at draft, immediately execute the campaign by calling "sendCampaign" with the generated campaignId.
9. After initiating execution, call "getCampaignPerformance" to check the initial performance of the campaign. Since delivery is simulated in the background, you can see initial delivery stats right away!
10. Present a clear, comprehensive final summary explaining:
    - The audience segment generated (filters applied).
    - Explanation of WHY those users were selected (with examples from your sample).
    - The channel selected and the drafted message template.
    - The created campaign ID and its execution status.
    - The live tracking stats (number of messages sent, delivered, read, clicked, etc. and rates).

Be concise, confident, and heavily oriented toward taking action.`,
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
  instructions:
    "You are a senior D2C marketing analyst. Suggest 3 high-converting audience segments for a daily CRM dashboard. Frame them to fix churn, maximize LTV, and leverage frequent buyers.",
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
  instructions:
    "You are an expert D2C copywriter. Generate marketing copy based on the parameters (context, tone, urgency). Keep it short, personalized, and avoid spam folder triggers.",
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
      prompt: `Audience Context / Goal: ${context}\nTone: ${tone}\nUrgency: ${urgency}`,
    });

    return result.output;
  },
};
