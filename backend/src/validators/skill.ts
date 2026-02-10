import { z } from "zod";
import { bilingualTextSchema, optionalBilingualTextSchema } from "./common";

export const skillCreateSchema = z.object({
  name: optionalBilingualTextSchema,
  category: optionalBilingualTextSchema,
  order: z.number().int().min(0).optional()
});

export const skillUpdateSchema = skillCreateSchema.partial();
