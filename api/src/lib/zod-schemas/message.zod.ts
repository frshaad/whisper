import sanitizeHtml from 'sanitize-html'
import z from 'zod'

import { MAX_MESSAGE_LENGTH } from '@/lib/constants'

export const messageSchema = z
  .object({
    text: z
      .string()
      .trim()
      .max(MAX_MESSAGE_LENGTH, {
        message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      })
      .optional()
      .transform((val) =>
        val
          ? sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} })
          : undefined,
      ),
    image: z.string().trim().url('Invalid image URL').optional(),
  })
  .refine(({ image, text }) => Boolean(text || image), {
    message: 'Either text or image is required',
  })
