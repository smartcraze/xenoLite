import { Queue } from "bullmq";
import { redis } from "../lib/redis";

export const CAMPAIGN_QUEUE_NAME = "campaign-queue";

export type CampaignJobPayload = {
    communicationId: string;
    customerId: string;
    campaignId: string;
    message: string;
    channel: string;
};

export const campaignQueue = new Queue<CampaignJobPayload>(
    CAMPAIGN_QUEUE_NAME,
    {
        connection: redis as any,
    },
);
