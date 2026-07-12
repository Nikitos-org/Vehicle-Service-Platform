import { z } from 'zod';

import { paginationMetaSchema } from '@/features/pagination/model/schemas/pagination.schemas';

export const userListItemSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  avatar: z.url().nullable(),
});

export const usersPageSchema = z.object({
  items: z.array(userListItemSchema),
  meta: paginationMetaSchema,
});
