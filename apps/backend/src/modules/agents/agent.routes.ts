import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { agentController } from "./agent.controller";

const agentRouter = Router();

agentRouter.post("/chat", asyncHandler(agentController.chatCampaign));
agentRouter.get("/suggestions", asyncHandler(agentController.suggestions));
agentRouter.post("/message", asyncHandler(agentController.generateMessageCopy));

export default agentRouter;
