import type { CreateCustomerInput } from "./customer.dto";
import { customerRepository } from "./customer.repository";

export const customerService = {
  listCustomers(city?: string, limit = 50) {
    return customerRepository.findMany(city, limit);
  },

  createCustomer(input: CreateCustomerInput) {
    return customerRepository.create(input);
  },
};
