import { z } from "zod";

export const createOrderSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  customerId: z.string().cuid(),
});

export const ordersQuerySchema = z.object({
  customerId: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrdersQueryInput = z.infer<typeof ordersQuerySchema>;
