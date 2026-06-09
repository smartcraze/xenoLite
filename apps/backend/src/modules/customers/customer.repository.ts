import { prisma } from "@repo/db";
import type { CreateCustomerInput, SeedCustomersInput } from "./customer.dto";

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

  async seed(
    input: SeedCustomersInput,
    factory: () => Array<{ amount: number; category: string }>,
  ) {
    const createdCustomers = await prisma.$transaction(async (transaction) => {
      const customers: any[] = [];

      for (let index = 0; index < input.customersCount; index += 1) {
        const orders = factory();

        const customer = await transaction.customer.create({
          data: {
            name: `Customer ${index + 1}`,
            email: `customer-${index + 1}@example.com`,
            phone: `+910000000${String(index + 1).padStart(2, "0")}`,
            city: ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai"][
              index % 5
            ] as string,
            totalSpent: orders.reduce((sum, order) => sum + order.amount, 0),
            orders: {
              create: orders,
            },
          },
          include: customerInclude,
        });

        customers.push(customer);
      }

      return customers;
    });

    return createdCustomers;
  },
};
