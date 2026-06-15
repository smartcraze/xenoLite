import { z } from "zod";

export const chatCampaignRequestSchema = z.object({
  prompt: z.string().optional(),
  messages: z.array(z.any()).optional(),
  stream: z.boolean().optional().default(true), // Default to true since useChat expects streams
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
