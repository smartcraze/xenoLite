import { prisma } from "@repo/db";
import type { CreateOrderInput } from "./order.dto";

export const orderRepository = {
  findMany(customerId?: string, limit = 50) {
    return prisma.order.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  create(input: CreateOrderInput) {
    return prisma.$transaction(async (transaction) => {
      const order = await transaction.order.create({
        data: input,
      });

      await transaction.customer.update({
        where: { id: input.customerId },
        data: {
          totalSpent: {
            increment: input.amount,
          },
        },
      });

      return order;
    });
  },
};
