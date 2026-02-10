import { z } from "zod";

export const bilingualTextSchema = z.object({
  en: z.string().min(0),
  fr: z.string().min(0)
});

export const optionalBilingualTextSchema = bilingualTextSchema.optional();
