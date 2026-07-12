import { z } from 'zod';

import { paginationMetaSchema } from '@/features/pagination/model/schemas/pagination.schemas';

export const vehicleListItemSchema = z.object({
  id: z.number(),
  isDraft: z.boolean(),
  make: z.string(),
  model: z.string(),
  userId: z.string(),
  year: z.number().nullable(),
});

export const vehiclesPageSchema = z.object({
  items: z.array(vehicleListItemSchema),
  meta: paginationMetaSchema,
});
