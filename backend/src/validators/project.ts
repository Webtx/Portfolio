import { z } from "zod";
import { bilingualTextSchema } from "./common";

export const projectCreateSchema = z.object({
  title: bilingualTextSchema,
  description: bilingualTextSchema,
  url: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  techStack: z.array(z.string().min(1)).default([]),
  featured: z.boolean().optional(),
  order: z.number().int().min(0).optional()
});

export const projectUpdateSchema = projectCreateSchema.partial();
