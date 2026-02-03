import { z } from "zod";
import { optionalBilingualTextSchema } from "./common";

export const contactInfoCreateSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5).optional(),
  location: optionalBilingualTextSchema,
  website: z.string().url().optional(),
  socials: z.record(z.string()).optional()
});

export const contactInfoUpdateSchema = contactInfoCreateSchema.partial();
