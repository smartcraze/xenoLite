import { prisma } from "@repo/db";
import { AppError } from "../../lib/errors";
import type { CreateOrderInput } from "./order.dto";
import { orderRepository } from "./order.repository";

export const orderService = {
  listOrders(customerId?: string, limit = 50) {
    return orderRepository.findMany(customerId, limit);
  },

  async createOrder(input: CreateOrderInput) {
    // Validate customer exists before creating the order
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new AppError(404, "Customer not found", "NOT_FOUND");
    }

    return orderRepository.create(input);
  },
};
