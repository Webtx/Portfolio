import { z } from "zod";

const fullNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+)+$/;

export const messageCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .refine((value) => fullNameRegex.test(value), {
      message: "Please enter a first and last name."
    }),
  email: z.string().email(),
  message: z.string().min(1)
});
