import { z } from "zod";
export const resumeCreateSchema = z.object({
  fileUrlEn: z.string().url(),
  fileUrlFr: z.string().url(),
  isActive: z.boolean().optional()
});

export const resumeUpdateSchema = resumeCreateSchema.partial();
