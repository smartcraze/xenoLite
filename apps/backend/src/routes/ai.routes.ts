import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { aiController } from "../modules/ai/ai.controller";

const aiRouter = Router();

aiRouter.post("/segment", asyncHandler(aiController.segment));
aiRouter.post("/message", asyncHandler(aiController.message));
aiRouter.post("/insights/:campaignId", asyncHandler(aiController.insights));

export default aiRouter;
