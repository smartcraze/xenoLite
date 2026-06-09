import { prisma } from "@repo/db";
import type { WebhookPayloadInput } from "./webhook.dto";

export const webhookRepository = {
    async updateCommunicationStatus(input: WebhookPayloadInput) {
        const { communicationId, status } = input;

        const updateData: any = {
            status,
        };

        const now = new Date();
        if (status === "SENT") updateData.sentAt = now;
        if (status === "DELIVERED") updateData.deliveredAt = now;
        if (status === "READ") updateData.readAt = now;
        if (status === "CLICKED") updateData.clickedAt = now;

        return prisma.communication.update({
            where: { id: communicationId },
            data: updateData,
            select: {
                id: true,
                campaignId: true,
                status: true,
            },
        });
    },

    findCommunication(communicationId: string) {
        return prisma.communication.findUnique({
            where: { id: communicationId },
            select: { id: true, status: true },
        });
    },
};
