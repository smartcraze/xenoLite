import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { orderController } from "../modules/orders/order.controller";

const ordersRouter = Router();

ordersRouter.get("/", asyncHandler(orderController.list));
ordersRouter.post("/", asyncHandler(orderController.create));

export default ordersRouter;
