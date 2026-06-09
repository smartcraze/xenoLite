import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { AppError } from "../../lib/errors";
import {
    campaignIdParamSchema,
    campaignsQuerySchema,
    createCampaignSchema,
} from "./campaign.dto";
import { campaignService } from "./campaign.service";

export const campaignController = {
    async list(request: Request, response: Response) {
        const query = campaignsQuerySchema.parse(request.query);
        const campaigns = await campaignService.listCampaigns(
            query.status,
            query.limit,
        );

        return sendSuccess(
            response,
            200,
            { campaigns },
            "Campaigns fetched successfully",
        );
    },

    async getOne(request: Request, response: Response) {
        const { id } = campaignIdParamSchema.parse(request.params);
        const campaign = await campaignService.getCampaign(id);

        if (!campaign) throw new AppError(404, "Campaign not found", "NOT_FOUND");

        return sendSuccess(
            response,
            200,
            { campaign },
            "Campaign fetched successfully",
        );
    },

    async create(request: Request, response: Response) {
        const body = createCampaignSchema.parse(request.body);
        const campaign = await campaignService.createCampaign(body);

        return sendSuccess(
            response,
            201,
            { campaign },
            "Campaign created successfully",
        );
    },

    async send(request: Request, response: Response) {
        const { id } = campaignIdParamSchema.parse(request.params);
        const result = await campaignService.sendCampaign(id);

        return sendSuccess(
            response,
            200,
            result,
            "Campaign send initiated successfully",
        );
    },
};
