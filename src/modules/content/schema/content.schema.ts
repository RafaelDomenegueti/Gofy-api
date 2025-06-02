import { z } from 'zod';

export const contentSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters')
    .optional(),
  url: z.string().min(1, 'URL must be at least 1 character').optional(),
  author: z
    .string()
    .min(3, 'Author must be at least 3 characters')
    .max(255, 'Author must be at most 255 characters'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

export type CreateContentDto = z.infer<typeof contentSchema>;
