import z from 'zod'

import {
  MAX_FULLNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  SEARCH_MIN_LIMIT,
  SEARCH_QUERY_REGEX,
} from '@/lib/constants'
import { bioSchema, fullnameSchema, profilePicSchema } from '@/lib/zod-schemas'

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

export const updateProfilePicSchema = z.object({
  profilePic: profilePicSchema,
})

export const searchUserQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(
      MIN_FULLNAME_LENGTH,
      `Search Query must be at least ${MIN_FULLNAME_LENGTH} characters`,
    )
    .max(
      MAX_FULLNAME_LENGTH,
      `Search Query must be less than ${MAX_FULLNAME_LENGTH} characters`,
    )
    .regex(
      SEARCH_QUERY_REGEX,
      'Search query must only contain letters, numbers, spaces, and underscores.',
    ),
  limit: z.coerce
    .number()
    .min(
      SEARCH_MIN_LIMIT,
      `Search results length must be at least ${SEARCH_MIN_LIMIT}`,
    )
    .max(
      SEARCH_MAX_LIMIT,
      `Search results length must be at least ${SEARCH_MAX_LIMIT}`,
    )
    .optional()
    .default(SEARCH_DEFAULT_LIMIT),
})

export type SearchQueryParams = z.infer<typeof searchUserQuerySchema>
