import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(6),
  city: z.string().min(1),
});

export const customersQuerySchema = z.object({
  city: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type CustomersQueryInput = z.infer<typeof customersQuerySchema>;
