import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import {
  chatCampaignRequestSchema,
  generateAgentMessageSchema,
} from "./agent.dto";
import { agentService } from "./agent.service";

export const agentController = {
  async chatCampaign(request: Request, response: Response) {
    const body = chatCampaignRequestSchema.parse(request.body);

    const messages = body.messages || (body.prompt ? [{ role: "user", content: body.prompt }] : []);

    if (messages.length === 0) {
      return response.status(400).json({ message: "Prompt or messages required" });
    }

    if (body.stream) {
      return agentService.chatCampaignBuilderStream(messages, response);
    }

    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content || lastMessage.text || "";
    const result = await agentService.chatCampaignBuilder(prompt);
    return sendSuccess(
      response,
      200,
      result,
      "Agent successfully completed the planning and drafting",
    );
  },

  async suggestions(_request: Request, response: Response) {
    const result = await agentService.getSegmentSuggestions();
    return sendSuccess(
      response,
      200,
      result,
      "Generated dashboard segmented suggestions",
    );
  },

  async generateMessageCopy(request: Request, response: Response) {
    const body = generateAgentMessageSchema.parse(request.body);
    const result = await agentService.generateMessage(
      body.context,
      body.tone,
      body.urgency,
    );

    return sendSuccess(
      response,
      200,
      result,
      "Generated tailored marketing copy",
    );
  },
};
