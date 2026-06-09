import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  OPENAI_API_KEY: z.string().default("dummy-key"),
  CHANNEL_SERVICE_URL: z.string().url().default("http://localhost:3001/send"),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => Number(val)),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  JWT_SECRET: z.string().default("crm-default-jwt-secret-key-123"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("\n❌ Invalid environment variables:\n");

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  console.error("\nFix your .env file before starting the server.\n");

  process.exit(1);
}

export const env = result.data;
