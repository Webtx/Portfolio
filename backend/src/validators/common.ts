import { z } from "zod";

export const bilingualTextSchema = z.object({
  en: z.string().min(1),
  fr: z.string().min(1)
});

export const optionalBilingualTextSchema = bilingualTextSchema.optional();
