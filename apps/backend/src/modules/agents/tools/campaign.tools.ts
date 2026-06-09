import { prisma } from "@repo/db";
import { tool } from "ai";
import { z } from "zod";
import { campaignRepository } from "../../campaigns/campaign.repository";
import { campaignService } from "../../campaigns/campaign.service";

export const createDraftCampaign = tool({
  description:
    "Create a campaign in DRAFT status. Specify the target channel, the message copy, and the audience query parameters.",
  inputSchema: z.object({
    name: z
      .string()
      .describe(
        "A concise, descriptive name for the campaign (e.g., 'Sneakers Reactivation Bengaluru')",
      ),
    message: z
      .string()
      .describe(
        "The copy of the marketing message, highly tailored and personalized",
      ),
    channel: z
      .enum(["WHATSAPP", "SMS", "EMAIL"])
      .describe("The delivery channel chosen (WHATSAPP, SMS, or EMAIL)"),
    audienceQuery: z
      .object({
        cities: z.array(z.string()).optional(),
        minSpent: z.number().optional(),
        inactiveDays: z.number().optional(),
        purchasedCategory: z.string().optional(),
        minCategoryCount: z.number().optional(),
        categoryStartDate: z.string().optional(),
        categoryEndDate: z.string().optional(),
        excludeCategorySince: z.string().optional(),
      })
      .describe("JSON representation of the audience filter used"),
  }),
  execute: async ({ name, message, channel, audienceQuery }) => {
    const campaign = await campaignService.createCampaign({
      name,
      message,
      channel,
      audienceQuery: JSON.stringify(audienceQuery),
    });
    return {
      success: true,
      campaignId: campaign.id,
      name: campaign.name,
      status: campaign.status,
      channel: campaign.channel,
      message: campaign.message,
    };
  },
});

export const sendCampaign = tool({
  description:
    "Send and execute a draft campaign by its campaign ID. This triggers the channel service mock to simulate delivery, transitions status, and kicks off tracking.",
  inputSchema: z.object({
    campaignId: z
      .string()
      .describe("The database ID of the campaign to execute"),
  }),
  execute: async ({ campaignId }) => {
    try {
      const result = await campaignService.sendCampaign(campaignId);
      return {
        success: true,
        ...result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send campaign",
      };
    }
  },
});

export const getCampaignPerformance = tool({
  description:
    "Track campaign performance live by querying real-time delivery counts (SENT, DELIVERED, READ, CLICKED, FAILED) and computing rates.",
  inputSchema: z.object({
    campaignId: z
      .string()
      .describe("The database ID of the campaign to inspect"),
  }),
  execute: async ({ campaignId }) => {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }

    const comms = await prisma.communication.groupBy({
      by: ["status"],
      where: { campaignId },
      _count: { id: true },
    });

    const counts = {
      PENDING: 0,
      SENT: 0,
      DELIVERED: 0,
      READ: 0,
      CLICKED: 0,
      FAILED: 0,
    };

    let total = 0;
    for (const group of comms) {
      const statusKey = group.status as keyof typeof counts;
      counts[statusKey] = group._count.id;
      total += group._count.id;
    }

    const sent = counts.SENT + counts.DELIVERED + counts.READ + counts.CLICKED;
    const delivered = counts.DELIVERED + counts.READ + counts.CLICKED;
    const read = counts.READ + counts.CLICKED;
    const clicked = counts.CLICKED;
    const failed = counts.FAILED;

    const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
    const readRate = delivered > 0 ? (read / delivered) * 100 : 0;
    const clickRate = read > 0 ? (clicked / read) * 100 : 0;

    return {
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        channel: campaign.channel,
        message: campaign.message,
        createdAt: campaign.createdAt,
      },
      metrics: {
        totalTargeted: total,
        pending: counts.PENDING,
        sent,
        delivered,
        read,
        clicked,
        failed,
      },
      rates: {
        deliveryRate: Number(deliveryRate.toFixed(1)),
        readRate: Number(readRate.toFixed(1)),
        clickRate: Number(clickRate.toFixed(1)),
      },
    };
  },
});
