import { z } from "zod";

const messageStatusEnum = z.enum([
    "PENDING",
    "SENT",
    "DELIVERED",
    "READ",
    "CLICKED",
    "FAILED",
]);

export const webhookPayloadSchema = z.object({
    communicationId: z.string().cuid(),
    status: messageStatusEnum,
});

export type WebhookPayloadInput = z.infer<typeof webhookPayloadSchema>;
