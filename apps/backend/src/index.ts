import express from "express";
import morgan from "morgan";

import { env } from "@/lib/env";
import { errorMiddleware } from "@/middleware/error.middleware";
import agentRouter from "@/modules/agents/agent.routes";
import analyticsRouter from "@/modules/analytics/analytics.routes";
import webhookRouter from "@/modules/webhooks/webhook.routes";
import aiRouter from "@/routes/ai.routes";
import campaignsRouter from "@/routes/campaigns.routes";
import customerRouter from "@/routes/customer.routes";
import ordersRouter from "@/routes/orders.routes";

import "@/workers/campaign.worker";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/campaigns", campaignsRouter);
app.use("/api/v1/webhooks", webhookRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/agents", agentRouter);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
