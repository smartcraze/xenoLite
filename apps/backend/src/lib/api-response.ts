import type { Response } from "express";

type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
};

export function sendSuccess<T>(
  response: Response,
  statusCode: number,
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
) {
  const payload: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (message) {
    payload.message = message;
  }

  if (meta) {
    payload.meta = meta;
  }

  return response.status(statusCode).json(payload);
}
