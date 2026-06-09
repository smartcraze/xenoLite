import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { createOrderSchema, ordersQuerySchema } from "./order.dto";
import { orderService } from "./order.service";

export const orderController = {
  async list(request: Request, response: Response) {
    const query = ordersQuerySchema.parse(request.query);
    const orders = await orderService.listOrders(query.customerId, query.limit);

    return sendSuccess(
      response,
      200,
      { orders },
      "Orders fetched successfully",
    );
  },

  async create(request: Request, response: Response) {
    const body = createOrderSchema.parse(request.body);
    const order = await orderService.createOrder(body);

    return sendSuccess(response, 201, { order }, "Order created successfully");
  },
};
