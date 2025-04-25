import { isValidObjectId } from 'mongoose'
import sanitizeHtml from 'sanitize-html'
import z from 'zod'

import { MAX_MESSAGE_LENGTH } from '@/lib/constants'

const rawMessageContentSchema = z.object({
  text: z.string().trim().max(MAX_MESSAGE_LENGTH).optional(),
  image: z.string().trim().url('Invalid image URL').optional(),
})

export const messageContentSchema = rawMessageContentSchema
  .transform(({ text, image }) => ({
    text: text
      ? sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim()
      : undefined,
    image,
  }))
  .refine(({ text, image }) => Boolean(text || image), {
    message: 'Either text or image is required',
  })

export const createMessageSchema = rawMessageContentSchema
  .extend({
    receiverId: z.string().refine(isValidObjectId, {
      message: 'Invalid receiver ID',
    }),
  })
  .refine(({ text, image }) => Boolean(text || image), {
    message: 'Either text or image is required',
  })

export type MessageContent = z.infer<typeof messageContentSchema>
export type CreateMessageInput = z.infer<typeof createMessageSchema>
