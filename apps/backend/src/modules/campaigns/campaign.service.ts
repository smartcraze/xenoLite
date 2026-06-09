import { prisma } from "@repo/db";
import { AppError } from "../../lib/errors";
import { campaignQueue } from "../../queues/campaign.queue";
import type { CreateCampaignInput } from "./campaign.dto";
import { campaignRepository } from "./campaign.repository";

export const campaignService = {
    listCampaigns(status?: any, limit = 50) {
        return campaignRepository.findMany(status, limit);
    },

    getCampaign(id: string) {
        return campaignRepository.findById(id);
    },

    createCampaign(input: CreateCampaignInput) {
        return campaignRepository.create(input);
    },

    async sendCampaign(id: string) {
        const campaign = await campaignRepository.findById(id);
        if (!campaign) {
            throw new AppError(404, "Campaign not found", "NOT_FOUND");
        }

        if (campaign.status !== "DRAFT") {
            throw new AppError(
                400,
                "Only DRAFT campaigns can be sent",
                "BAD_REQUEST",
            );
        }

        // 1. Fetch audience
        let prismaWhereClause = {};
        if (campaign.audienceQuery) {
            try {
                const parsed = JSON.parse(campaign.audienceQuery);
                // Assume simple shape: { cities: string[], minSpent: number }
                if (parsed.cities?.length) {
                    prismaWhereClause = {
                        ...prismaWhereClause,
                        city: { in: parsed.cities },
                    };
                }
                if (typeof parsed.minSpent === "number") {
                    prismaWhereClause = {
                        ...prismaWhereClause,
                        totalSpent: { gte: parsed.minSpent },
                    };
                }
            } catch (e) {
                console.warn("Invalid audience query JSON", campaign.audienceQuery);
            }
        }

        const audience = await prisma.customer.findMany({
            where: prismaWhereClause,
            select: { id: true },
        });

        if (audience.length === 0) {
            throw new AppError(400, "Audience is empty, cannot send", "BAD_REQUEST");
        }

        // 2. Set campaign to RUNNING
        await campaignRepository.updateStatus(id, "RUNNING");

        // 3. Create communication records
        const customerIds = audience.map((a) => a.id);
        const communications = await campaignRepository.createCommunications(
            id,
            customerIds,
        );

        // 4. Push jobs to BullMQ
        const jobs = communications.map((comm) => ({
            name: "send-message",
            data: {
                communicationId: comm.id,
                customerId: comm.customerId,
                campaignId: id,
                message: campaign.message,
                channel: campaign.channel,
            },
        })) as any;

        await campaignQueue.addBulk(jobs);

        return {
            campaignId: id,
            status: "RUNNING",
            targetedCustomers: audience.length,
            jobsEnqueued: jobs.length,
        };
    },
};
