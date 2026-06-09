import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { createCustomerSchema, customersQuerySchema } from "./customer.dto";
import { customerService } from "./customer.service";

export const customerController = {
  async list(request: Request, response: Response) {
    const query = customersQuerySchema.parse(request.query);
    const customers = await customerService.listCustomers(
      query.city,
      query.limit,
    );

    return sendSuccess(
      response,
      200,
      { customers },
      "Customers fetched successfully",
    );
  },

  async create(request: Request, response: Response) {
    const body = createCustomerSchema.parse(request.body);
    const customer = await customerService.createCustomer(body);

    return sendSuccess(
      response,
      201,
      { customer },
      "Customer created successfully",
    );
  },
};
