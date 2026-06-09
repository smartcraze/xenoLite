import { prisma } from "@repo/db";
import type { CreateCustomerInput } from "./customer.dto";

const customerInclude = {
  orders: {
    orderBy: {
      createdAt: "desc" as const,
    },
  },
} as const;

export const customerRepository = {
  findMany(city?: string, limit = 50) {
    return prisma.customer.findMany({
      where: city ? { city } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: customerInclude,
    });
  },

  create(input: CreateCustomerInput) {
    return prisma.customer.create({
      data: {
        ...input,
      },
      include: customerInclude,
    });
  },
};
