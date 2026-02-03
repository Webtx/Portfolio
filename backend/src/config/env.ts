import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1),
  AUTH0_ISSUER_BASE_URL: z.string().url(),
  AUTH0_AUDIENCE: z.string().min(1),
  ADMIN_PERMISSION: z.string().default("admin:full"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  CLOUDINARY_URL: z.string().min(1)
});

export const env = envSchema.parse(process.env);
