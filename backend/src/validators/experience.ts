import { z } from "zod";
import { bilingualTextSchema, optionalBilingualTextSchema } from "./common";

export const experienceCreateSchema = z.object({
  company: bilingualTextSchema,
  role: bilingualTextSchema,
  description: bilingualTextSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
  location: optionalBilingualTextSchema,
  order: z.number().int().min(0).optional()
});

export const experienceUpdateSchema = experienceCreateSchema.partial();
