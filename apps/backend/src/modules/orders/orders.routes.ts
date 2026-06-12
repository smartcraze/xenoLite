import { asyncHandler } from "@/lib/async-handler";
import { authMiddleware } from "@/middleware/auth.middleware";
import { Router } from "express";
import { orderController } from "./order.controller";

const ordersRouter = Router();
ordersRouter.use(authMiddleware);

ordersRouter.get("/", asyncHandler(orderController.list));
ordersRouter.post("/", asyncHandler(orderController.create));

export default ordersRouter;
