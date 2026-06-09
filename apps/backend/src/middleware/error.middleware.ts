import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isAppError } from "../lib/errors";

type ErrorPayload = {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
};

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    const payload: ErrorPayload = {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
    };

    return response.status(400).json(payload);
  }

  if (isAppError(error)) {
    const payload: ErrorPayload = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
    };

    return response.status(error.statusCode).json(payload);
  }

  const payload: ErrorPayload = {
    success: false,
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
  };

  return response.status(500).json(payload);
}
