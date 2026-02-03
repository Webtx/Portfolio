import { z } from "zod";
import { bilingualTextSchema, optionalBilingualTextSchema } from "./common";

export const educationCreateSchema = z.object({
  school: bilingualTextSchema,
  degree: bilingualTextSchema,
  field: optionalBilingualTextSchema,
  description: optionalBilingualTextSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  order: z.number().int().min(0).optional()
});

export const educationUpdateSchema = educationCreateSchema.partial();
