import z from 'zod'

import { fullnameSchema } from '@/lib/zod-schemas'

export const updateUserInfoSchema = z
  .object({
    fullname: fullnameSchema.optional(),
    profilePic: z
      .string()
      .url({ message: 'Profile picture must be a valid URL' })
      .optional(),
  })
  .refine((data) => data.fullname || data.profilePic, {
    message: 'At least one of fullname or profilePic must be provided',
  })
