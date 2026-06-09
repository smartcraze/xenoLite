import rateLimitLib from "express-rate-limit";
import { AppError } from "../lib/errors";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export function rateLimit(options: RateLimitOptions) {
  return rateLimitLib({
    windowMs: options.windowMs,
    limit: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(
        new AppError(
          429,
          options.message || "Too many requests, please try again later.",
          "TOO_MANY_REQUESTS",
        ),
      );
    },
  });
}
