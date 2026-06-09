import { z } from "zod";

export const chatCampaignRequestSchema = z.object({
  prompt: z.string().min(1),
  stream: z.boolean().optional().default(false),
});

export const generateAgentMessageSchema = z.object({
  context: z.string().min(1),
  tone: z.string().default("Friendly"),
  urgency: z.string().default("Low"),
});

export type ChatCampaignRequestInput = z.infer<
  typeof chatCampaignRequestSchema
>;
export type GenerateAgentMessageInput = z.infer<
  typeof generateAgentMessageSchema
>;
