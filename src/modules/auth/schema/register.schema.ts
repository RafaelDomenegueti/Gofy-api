import { z } from 'zod';

export const nameSchema = z.string().min(3).max(255);

export const emailSchema = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z.string().min(8).max(255);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterAuthDto = z.infer<typeof registerSchema>;
