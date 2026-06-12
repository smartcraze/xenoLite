import { Router } from "express";
import { asyncHandler } from "@/lib/async-handler";
import { authMiddleware } from "@/middleware/auth.middleware";
import { customerController } from "./customer.controller";

const customerRouter = Router();
customerRouter.use(authMiddleware);

customerRouter.get("/", asyncHandler(customerController.list));
customerRouter.post("/", asyncHandler(customerController.create));

export default customerRouter;
