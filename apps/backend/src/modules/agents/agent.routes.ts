import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { rateLimit } from "../../middleware/rate-limit.middleware";
import { agentController } from "./agent.controller";

const agentRouter = Router();

// agentRouter.use(authMiddleware);

// Chat campaign is very expensive (multi-step OpenAI calls + db queries), limit to 3 requests per minute
const chatLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message:
    "Too many campaign requests. Please wait a minute before creating another campaign.",
});

// Suggestions and message generation are single calls, limit to 10 requests per minute
const standardLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: "Rate limit exceeded. Please try again in a minute.",
});

agentRouter.post(
  "/chat",
  chatLimit,
  asyncHandler(agentController.chatCampaign),
);

agentRouter.get(
  "/suggestions",
  standardLimit,
  asyncHandler(agentController.suggestions),
);
agentRouter.post(
  "/message",
  standardLimit,
  asyncHandler(agentController.generateMessageCopy),
);

export default agentRouter;
