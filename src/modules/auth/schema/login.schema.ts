import { z } from 'zod';

export const emailSchema = z
  .string()
  .email()
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z.string().min(8).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginAuthDto = z.infer<typeof loginSchema>;
