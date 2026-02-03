import { z } from "zod";
import { optionalBilingualTextSchema } from "./common";

export const resumeCreateSchema = z.object({
  title: optionalBilingualTextSchema,
  fileUrl: z.string().url(),
  isActive: z.boolean().optional()
});

export const resumeUpdateSchema = resumeCreateSchema.partial();
