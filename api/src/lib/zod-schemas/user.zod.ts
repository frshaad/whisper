import z from 'zod'

import { bioSchema, fullnameSchema } from '@/lib/zod-schemas'

export const updateUserInfoSchema = z
  .object({
    fullname: fullnameSchema,
    bio: bioSchema,
  })
  .partial()
  .refine((data) => data.fullname || data.bio, {
    message: 'At least one of fullname or bio must be provided',
  })

export type UpdateUserInfoObj = z.infer<typeof updateUserInfoSchema>
