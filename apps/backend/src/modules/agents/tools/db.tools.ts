import { prisma } from "@repo/db";
import { tool } from "ai";
import { z } from "zod";

export const countAudience = tool({
  description:
    "Query the database to count how many users match specific filters (demographic, spending, inactivity, category purchased, and date limits). Use this to validate if a segment is viable.",

  inputSchema: z.object({
    cities: z.array(z.string()).optional().describe("List of cities to target"),
    minSpent: z
      .number()
      .optional()
      .describe("Minimum total spent amount by the customer"),
    inactiveDays: z
      .number()
      .optional()
      .describe(
        "Number of days since their last order (e.g., 45 for users who haven't ordered in 45 days)",
      ),
    purchasedCategory: z
      .string()
      .optional()
      .describe(
        "Filter by a specific category of item purchased (e.g., 'sneakers', 'coffee')",
      ),
    minCategoryCount: z
      .number()
      .optional()
      .describe(
        "Minimum number of times the customer purchased from the category (e.g., 2 times)",
      ),
    categoryStartDate: z
      .string()
      .optional()
      .describe(
        "Start date for the category order count (ISO format, e.g., '2026-05-01')",
      ),
    categoryEndDate: z
      .string()
      .optional()
      .describe(
        "End date for the category order count (ISO format, e.g., '2026-05-31')",
      ),
    excludeCategorySince: z
      .string()
      .optional()
      .describe(
        "Exclude customers who ordered from the category since this date (ISO format, e.g., '2026-06-03')",
      ),
  }),
  execute: async ({
    cities,
    minSpent,
    inactiveDays,
    purchasedCategory,
    minCategoryCount,
    categoryStartDate,
    categoryEndDate,
    excludeCategorySince,
  }) => {
    const where: any = {};

    if (cities && cities.length > 0) {
      where.city = { in: cities };
    }
    if (minSpent !== undefined) {
      where.totalSpent = { gte: minSpent };
    }
    if (inactiveDays !== undefined) {
      const dateCutoff = new Date();
      dateCutoff.setDate(dateCutoff.getDate() - inactiveDays);
      where.orders = {
        none: {
          createdAt: { gte: dateCutoff },
        },
      };
    }

    // Advanced category queries
    if (purchasedCategory) {
      const categoryFilters: any = {
        category: { equals: purchasedCategory, mode: "insensitive" },
      };

      if (categoryStartDate || categoryEndDate) {
        categoryFilters.createdAt = {};
        if (categoryStartDate)
          categoryFilters.createdAt.gte = new Date(categoryStartDate);
        if (categoryEndDate)
          categoryFilters.createdAt.lte = new Date(categoryEndDate);
      }

      if (minCategoryCount !== undefined && minCategoryCount > 1) {
        // Find customers who have at least minCategoryCount orders in the category
        // Prisma doesn't support nested array size filters directly, so we can run a subquery or filter by count
        // For simplicity and efficiency, let's query customer IDs matching this using groupBy
        const customerIdsWithMinOrders = await prisma.order.groupBy({
          by: ["customerId"],
          where: categoryFilters,
          _count: { id: true },
          having: {
            id: {
              _count: { gte: minCategoryCount },
            },
          },
        });
        const matchedIds = customerIdsWithMinOrders.map((o) => o.customerId);
        where.id = { in: matchedIds };
      } else {
        where.orders = {
          some: categoryFilters,
        };
      }
    }

    // Exclude category since date
    if (excludeCategorySince && purchasedCategory) {
      const excludeDate = new Date(excludeCategorySince);
      // We want customers who have NOT bought this category since excludeDate
      // We modify where to ensure they have none orders in the category since that date
      const originalIdFilter = where.id;

      const excludedCustomerIds = await prisma.order.findMany({
        where: {
          category: { equals: purchasedCategory, mode: "insensitive" },
          createdAt: { gte: excludeDate },
        },
        select: { customerId: true },
      });
      const excludedIds = excludedCustomerIds.map((o) => o.customerId);

      if (originalIdFilter?.in) {
        where.id = {
          in: originalIdFilter.in.filter(
            (id: string) => !excludedIds.includes(id),
          ),
        };
      } else {
        where.id = { notIn: excludedIds };
      }
    }

    const count = await prisma.customer.count({ where });
    return {
      count,
      filterApplied: {
        cities,
        minSpent,
        inactiveDays,
        purchasedCategory,
        minCategoryCount,
        categoryStartDate,
        categoryEndDate,
        excludeCategorySince,
      },
    };
  },
});

export const getAudienceSample = tool({
  description:
    "Retrieve a sample of up to 10 customers matching the filters. Useful to explain WHY they were selected and display concrete examples of the targeted audience.",
  inputSchema: z.object({
    cities: z.array(z.string()).optional(),
    minSpent: z.number().optional(),
    inactiveDays: z.number().optional(),
    purchasedCategory: z.string().optional(),
    minCategoryCount: z.number().optional(),
    categoryStartDate: z.string().optional(),
    categoryEndDate: z.string().optional(),
    excludeCategorySince: z.string().optional(),
  }),
  execute: async ({
    cities,
    minSpent,
    inactiveDays,
    purchasedCategory,
    minCategoryCount,
    categoryStartDate,
    categoryEndDate,
    excludeCategorySince,
  }) => {
    const where: any = {};

    if (cities && cities.length > 0) {
      where.city = { in: cities };
    }
    if (minSpent !== undefined) {
      where.totalSpent = { gte: minSpent };
    }
    if (inactiveDays !== undefined) {
      const dateCutoff = new Date();
      dateCutoff.setDate(dateCutoff.getDate() - inactiveDays);
      where.orders = {
        none: {
          createdAt: { gte: dateCutoff },
        },
      };
    }

    if (purchasedCategory) {
      const categoryFilters: any = {
        category: { equals: purchasedCategory, mode: "insensitive" },
      };

      if (categoryStartDate || categoryEndDate) {
        categoryFilters.createdAt = {};
        if (categoryStartDate)
          categoryFilters.createdAt.gte = new Date(categoryStartDate);
        if (categoryEndDate)
          categoryFilters.createdAt.lte = new Date(categoryEndDate);
      }

      if (minCategoryCount !== undefined && minCategoryCount > 1) {
        const customerIdsWithMinOrders = await prisma.order.groupBy({
          by: ["customerId"],
          where: categoryFilters,
          _count: { id: true },
          having: {
            id: {
              _count: { gte: minCategoryCount },
            },
          },
        });
        const matchedIds = customerIdsWithMinOrders.map((o) => o.customerId);
        where.id = { in: matchedIds };
      } else {
        where.orders = {
          some: categoryFilters,
        };
      }
    }

    if (excludeCategorySince && purchasedCategory) {
      const excludeDate = new Date(excludeCategorySince);
      const excludedCustomerIds = await prisma.order.findMany({
        where: {
          category: { equals: purchasedCategory, mode: "insensitive" },
          createdAt: { gte: excludeDate },
        },
        select: { customerId: true },
      });
      const excludedIds = excludedCustomerIds.map((o) => o.customerId);

      const originalIdFilter = where.id;
      if (originalIdFilter?.in) {
        where.id = {
          in: originalIdFilter.in.filter(
            (id: string) => !excludedIds.includes(id),
          ),
        };
      } else {
        where.id = { notIn: excludedIds };
      }
    }

    const customers = await prisma.customer.findMany({
      where,
      take: 10,
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      city: c.city,
      totalSpent: c.totalSpent,
      createdAt: c.createdAt,
      recentOrders: c.orders.map((o) => ({
        id: o.id,
        amount: o.amount,
        category: o.category,
        createdAt: o.createdAt,
      })),
    }));
  },
});
