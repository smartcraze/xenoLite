import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { rateLimit } from "../../middleware/rate-limit.middleware";
import { authController } from "./auth.controller";

const authRouter = Router();

// Apply brute-force protection to login and signup (max 5 attempts per minute)
const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many authentication attempts. Please try again in a minute.",
});

authRouter.post("/signup", authRateLimit, asyncHandler(authController.signup));
authRouter.post("/login", authRateLimit, asyncHandler(authController.login));

export default authRouter;
