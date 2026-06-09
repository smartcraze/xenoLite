import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { campaignController } from "../modules/campaigns/campaign.controller";

const campaignsRouter = Router();

campaignsRouter.get("/", asyncHandler(campaignController.list));
campaignsRouter.post("/", asyncHandler(campaignController.create));
campaignsRouter.get("/:id", asyncHandler(campaignController.getOne));
campaignsRouter.post("/:id/send", asyncHandler(campaignController.send));

export default campaignsRouter;
