import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { webhookController } from "./webhook.controller";

const webhookRouter = Router();

webhookRouter.post(
    "/status",
    asyncHandler(webhookController.handleStatusCallback),
);

export default webhookRouter;
