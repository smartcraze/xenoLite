import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import { env } from "../../lib/env";
import { AppError } from "../../lib/errors";
import type { LoginRequestInput, SignupRequestInput } from "./auth.dto";

export const authService = {
  async signup(input: SignupRequestInput) {
    // 1. Check if email is already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (existingEmail) {
      throw new AppError(
        409,
        "Email is already registered.",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    // 2. Hash the password using Bun's native password hashing
    const passwordHash = await Bun.password.hash(input.password);

    // 3. Create the user record
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      user,
    };
  },

  async login(input: LoginRequestInput) {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new AppError(401, "Invalid email or password.", "UNAUTHORIZED");
    }

    // 2. Verify password
    const isPasswordValid = await Bun.password.verify(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password.", "UNAUTHORIZED");
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  },
};
