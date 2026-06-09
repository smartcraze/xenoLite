import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { analyticsController } from "./analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get(
  "/:campaignId",
  asyncHandler(analyticsController.getAnalytics),
);

export default analyticsRouter;
