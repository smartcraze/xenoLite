import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(6),
  city: z.string().min(1),
});

export const seedCustomersSchema = z.object({
  customersCount: z.number().int().min(1).max(500).default(25),
  minOrdersPerCustomer: z.number().int().min(0).max(20).default(1),
  maxOrdersPerCustomer: z.number().int().min(0).max(20).default(5),
});

export const customersQuerySchema = z.object({
  city: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type SeedCustomersInput = z.infer<typeof seedCustomersSchema>;
export type CustomersQueryInput = z.infer<typeof customersQuerySchema>;
