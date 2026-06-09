import { faker } from "@faker-js/faker";
import type { CreateCustomerInput, SeedCustomersInput } from "./customer.dto";
import { customerRepository } from "./customer.repository";

function createFakeOrders(
  minOrdersPerCustomer: number,
  maxOrdersPerCustomer: number,
) {
  const orderCount = faker.number.int({
    min: minOrdersPerCustomer,
    max: maxOrdersPerCustomer,
  });

  return Array.from({ length: orderCount }, () => ({
    amount: Number(faker.commerce.price({ min: 499, max: 14999, dec: 2 })),
    category: faker.helpers.arrayElement([
      "Sneakers",
      "Apparel",
      "Accessories",
      "Beauty",
      "Home",
    ]),
  }));
}

export const customerService = {
  listCustomers(city?: string, limit = 50) {
    return customerRepository.findMany(city, limit);
  },

  createCustomer(input: CreateCustomerInput) {
    return customerRepository.create(input);
  },

  async seedCustomers(input: SeedCustomersInput) {
    const customers = await customerRepository.seed(input, () =>
      createFakeOrders(input.minOrdersPerCustomer, input.maxOrdersPerCustomer),
    );

    return {
      customersCreated: customers.length,
      ordersCreated: customers.reduce(
        (sum, customer) => sum + customer.orders.length,
        0,
      ),
      customers,
    };
  },
};
