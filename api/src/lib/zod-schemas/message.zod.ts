import z from 'zod'

import { MAX_MESSAGE_LENGTH } from '@/lib/constants'

export const messageContentSchema = z
  .object({
    text: z.string().trim().max(MAX_MESSAGE_LENGTH).optional(),
    image: z.string().trim().url('Invalid image URL').optional(),
  })
  .refine(({ text, image }) => Boolean(text || image), {
    message: 'Either text or image is required',
  })

export type MessageContent = z.infer<typeof messageContentSchema>

export const getMessagesQuerySchema = z.object({
  cursor: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
})
