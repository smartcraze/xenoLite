import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { AppError } from "../lib/errors";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError(
        401,
        "Access denied. No authorization header provided.",
        "UNAUTHORIZED",
      ),
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(
      new AppError(
        401,
        "Access denied. Authorization header must follow 'Bearer <token>' format.",
        "UNAUTHORIZED",
      ),
    );
  }

  const token = parts[1] as string;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as any;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError(
          401,
          "Authorization token has expired. Please log in again.",
          "TOKEN_EXPIRED",
        ),
      );
    }
    return next(
      new AppError(
        401,
        "Access denied. Invalid authorization token.",
        "UNAUTHORIZED",
      ),
    );
  }
}
