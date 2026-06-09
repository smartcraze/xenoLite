import { analyticsRepository } from "./analytics.repository";

export const analyticsService = {
    async getCampaignAnalytics(campaignId: string) {
        const { total, groups } =
            await analyticsRepository.getCampaignMetrics(campaignId);

        let sent = 0;
        let delivered = 0;
        let read = 0;
        let clicked = 0;
        let failed = 0;

        for (const group of groups) {
            const count = group._count.status;
            switch (group.status) {
                case "SENT":
                    sent += count;
                    break;
                case "DELIVERED":
                    delivered += count;
                    break;
                case "READ":
                    read += count;
                    break;
                case "CLICKED":
                    clicked += count;
                    break;
                case "FAILED":
                    failed += count;
                    break;
            }
        }

        // Delivered count implies it was also sent initially, but status represents current state.
        // Actually, for rate calculation:
        // Total Sent Attempted = PENDING + SENT + DELIVERED + READ + CLICKED + FAILED
        // Successful Sent = SENT + DELIVERED + READ + CLICKED
        const successfulSent = sent + delivered + read + clicked;

        const sentRate = total > 0 ? (successfulSent / total) * 100 : 0;
        const deliveryRate =
            successfulSent > 0
                ? ((delivered + read + clicked) / successfulSent) * 100
                : 0;
        const readRate =
            delivered + read + clicked > 0
                ? ((read + clicked) / (delivered + read + clicked)) * 100
                : 0;
        const clickRate = total > 0 ? (clicked / total) * 100 : 0; // CTR based on total attempts or deliveries

        return {
            totalTargeted: total,
            metrics: {
                sent,
                delivered,
                read,
                clicked,
                failed,
            },
            rates: {
                sentRate: Number(sentRate.toFixed(2)),
                deliveryRate: Number(deliveryRate.toFixed(2)),
                readRate: Number(readRate.toFixed(2)),
                ctr: Number(clickRate.toFixed(2)),
            },
        };
    },
};
