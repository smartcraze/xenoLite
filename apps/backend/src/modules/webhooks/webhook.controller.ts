import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { webhookPayloadSchema } from "./webhook.dto";
import { webhookService } from "./webhook.service";

export const webhookController = {
    async handleStatusCallback(request: Request, response: Response) {
        const payload = webhookPayloadSchema.parse(request.body);

        await webhookService.processStatusUpdate(payload);

        return sendSuccess(
            response,
            200,
            { received: true },
            "Webhook processed successfully",
        );
    },
};
