import { z } from "zod";
import { bilingualTextSchema, optionalBilingualTextSchema } from "./common";

export const hobbyCreateSchema = z.object({
  name: bilingualTextSchema,
  description: optionalBilingualTextSchema,
  order: z.number().int().min(0).optional()
});

export const hobbyUpdateSchema = hobbyCreateSchema.partial();
