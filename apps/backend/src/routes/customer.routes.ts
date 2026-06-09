import { Router } from "express";
import { asyncHandler } from "../lib/async-handler";
import { customerController } from "../modules/customers/customer.controller";

const customerRouter = Router();

customerRouter.get("/", asyncHandler(customerController.list));
customerRouter.post("/", asyncHandler(customerController.create));
customerRouter.post("/seed", asyncHandler(customerController.seed));

export default customerRouter;
