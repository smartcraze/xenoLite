import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import {
  insightsParamSchema,
  insightsRequestSchema,
  messageRequestSchema,
  segmentRequestSchema,
} from "./ai.dto";
import { aiService } from "./ai.service";

export const aiController = {
  async segment(request: Request, response: Response) {
    const body = segmentRequestSchema.parse(request.body);
    const result = await aiService.generateSegment(body);

    return sendSuccess(
      response,
      200,
      result,
      "Audience segment generated successfully",
    );
  },

  async message(request: Request, response: Response) {
    const body = messageRequestSchema.parse(request.body);
    const result = await aiService.generateMessage(body);

    return sendSuccess(
      response,
      200,
      result,
      "Marketing message generated successfully",
    );
  },

  async insights(request: Request, response: Response) {
    const params = insightsParamSchema.parse(request.params);
    const body = insightsRequestSchema.parse(request.body || {});

    const result = await aiService.generateInsights(
      params.campaignId,
      body.prompt,
    );

    return sendSuccess(
      response,
      200,
      result,
      "Campaign insights generated successfully",
    );
  },
};
