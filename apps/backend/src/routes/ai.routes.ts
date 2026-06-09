import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rate-limit.middleware";
import { aiController } from "../modules/ai/ai.controller";

const aiRouter = Router();
aiRouter.use(authMiddleware);

const standardLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Rate limit exceeded. Please try again in a minute.",
});

aiRouter.post("/segment", standardLimit, asyncHandler(aiController.segment));
aiRouter.post("/message", standardLimit, asyncHandler(aiController.message));
aiRouter.post(
  "/insights/:campaignId",
  standardLimit,
  asyncHandler(aiController.insights),
);

export default aiRouter;
