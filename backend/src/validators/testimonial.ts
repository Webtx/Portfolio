import { z } from "zod";

export const testimonialCreateSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  content: z.string().min(1)
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();
