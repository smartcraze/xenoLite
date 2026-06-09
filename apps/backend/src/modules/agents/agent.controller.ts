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

    if (body.stream) {
      return agentService.chatCampaignBuilderStream(body.prompt, response);
    }

    const result = await agentService.chatCampaignBuilder(body.prompt);
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
