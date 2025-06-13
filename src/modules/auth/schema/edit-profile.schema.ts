import { z } from 'zod';
import { nameSchema, emailSchema } from './register.schema';

export const phoneSchema = z.string().min(10).max(15);

export const editProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
});

export type EditProfileDto = z.infer<typeof editProfileSchema>;
