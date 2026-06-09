import { AppError } from "../../lib/errors";
import type { WebhookPayloadInput } from "./webhook.dto";
import { webhookRepository } from "./webhook.repository";

export const webhookService = {
    async processStatusUpdate(input: WebhookPayloadInput) {
        const communication = await webhookRepository.findCommunication(
            input.communicationId,
        );

        if (!communication) {
            throw new AppError(404, "Communication record not found", "NOT_FOUND");
        }

        // Normally, we'd handle idempotent updates or state machine validation here,
        // e.g. don't update to DELIVERED if it's already CLICKED. For simplicity, just update.
        return webhookRepository.updateCommunicationStatus(input);
    },
};
