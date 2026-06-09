import { type Job, Worker } from "bullmq";
import { env } from "../lib/env";
import { redis } from "../lib/redis";
import {
    CAMPAIGN_QUEUE_NAME, type CampaignJobPayload,
} from "../queues/campaign.queue";

export const campaignWorker = new Worker<CampaignJobPayload>(
    CAMPAIGN_QUEUE_NAME,
    async (job: Job<CampaignJobPayload>) => {
        const { communicationId, message, channel } = job.data;

        try {
            const response = await fetch(env.CHANNEL_SERVICE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    communicationId,
                    message,
                    channel,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    `Channel service responded with status ${response.status}`,
                );
            }

            console.log(`Job processed for communication: ${communicationId}`);
        } catch (error) {
            console.error(
                `Failed to process job for communication ${communicationId}:`,
                error,
            );
            throw error; // Let BullMQ handle retries
        }
    },
    {
        connection: redis as any,
        concurrency: 5,
    },
);

campaignWorker.on("failed", (job, err) => {
    console.warn(`Job ${job?.id} failed with error: ${err.message}`);
});
