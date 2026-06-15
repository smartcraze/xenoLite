import { Router } from "express";
import { asyncHandler } from "@/lib/async-handler";
import { authMiddleware } from "@/middleware/auth.middleware";
import { campaignController } from "./campaign.controller";

const campaignsRouter = Router();
campaignsRouter.use(authMiddleware);

campaignsRouter.get("/", asyncHandler(campaignController.list));
campaignsRouter.post("/", asyncHandler(campaignController.create));
campaignsRouter.get("/:id", asyncHandler(campaignController.getOne));
campaignsRouter.post("/:id/send", asyncHandler(campaignController.send));

export default campaignsRouter;
