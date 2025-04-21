import z from 'zod'

import {
  bioSchema,
  fullnameSchema,
  statusEmojiSchema,
  usernameSchema,
} from '@/lib/zod-schemas'

export const updateUserInfoSchema = z
  .object({
    fullname: fullnameSchema,
    username: usernameSchema,
    bio: bioSchema,
    statusEmoji: statusEmojiSchema,
  })
  .partial()
  .refine(
    (data) => data.fullname || data.bio || data.statusEmoji || data.username,
    { message: 'At least one of fullname or profilePic must be provided' },
  )

export type UpdateUserInfoObj = z.infer<typeof updateUserInfoSchema>
