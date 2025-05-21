import { z } from 'zod';

export const createPurchaseSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
});

export type CreatePurchaseDto = z.infer<typeof createPurchaseSchema>;
