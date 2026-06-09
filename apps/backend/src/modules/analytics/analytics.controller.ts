import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { analyticsParamsSchema } from "./analytics.dto";
import { analyticsService } from "./analytics.service";

export const analyticsController = {
  async getAnalytics(request: Request, response: Response) {
    const { campaignId } = analyticsParamsSchema.parse(request.params);

    const analytics = await analyticsService.getCampaignAnalytics(campaignId);

    return sendSuccess(
      response,
      200,
      analytics,
      "Analytics fetched successfully",
    );
  },
};
