import { prisma } from "@repo/db";

export const analyticsRepository = {
    async getCampaignMetrics(campaignId: string) {
        // Group by status
        const grouped = await prisma.communication.groupBy({
            by: ["status"],
            where: { campaignId },
            _count: {
                status: true,
            },
        });

        // Total count
        const total = await prisma.communication.count({
            where: { campaignId },
        });

        return {
            total,
            groups: grouped,
        };
    },
};
