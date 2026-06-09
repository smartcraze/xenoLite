import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/api-response";
import { loginRequestSchema, signupRequestSchema } from "./auth.dto";
import { authService } from "./auth.service";

export const authController = {
  async signup(request: Request, response: Response) {
    const body = signupRequestSchema.parse(request.body);
    const result = await authService.signup(body);

    return sendSuccess(response, 201, result, "User registered successfully");
  },

  async login(request: Request, response: Response) {
    const body = loginRequestSchema.parse(request.body);
    const result = await authService.login(body);

    return sendSuccess(response, 200, result, "User logged in successfully");
  },
};
