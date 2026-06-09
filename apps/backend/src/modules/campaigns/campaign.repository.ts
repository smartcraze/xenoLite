import { prisma } from "@repo/db";
import type { CreateCampaignInput } from "./campaign.dto";

export const campaignRepository = {
    findMany(status?: any, limit = 50) {
        return prisma.campaign.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    findById(id: string) {
        return prisma.campaign.findUnique({
            where: { id },
        });
    },

    create(input: CreateCampaignInput) {
        return prisma.campaign.create({
            data: input,
        });
    },

    updateStatus(id: string, status: any) {
        return prisma.campaign.update({
            where: { id },
            data: { status },
        });
    },

    async createCommunications(campaignId: string, customerIds: string[]) {
        const payload = customerIds.map((customerId) => ({
            campaignId,
            customerId,
            status: "PENDING" as const,
        }));

        await prisma.communication.createMany({
            data: payload,
        });

        // Return the created ones to put in the queue
        return prisma.communication.findMany({
            where: { campaignId },
            select: { id: true, customerId: true },
        });
    },
};
