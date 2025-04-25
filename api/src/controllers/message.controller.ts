import type { Request, Response } from 'express'
import sanitizeHtml from 'sanitize-html'

import { handleError } from '@/lib/errors'
import { requireUser, sanitizeMessage, validateObjectId } from '@/lib/utils'
import {
  getMessagesQuerySchema,
  messageContentSchema,
} from '@/lib/zod-schemas/message.zod'
import {
  getMessagesWithUserService,
  sendMessageService,
} from '@/services/message.service'

export async function getMessagesWithUser(req: Request, res: Response) {
  try {
    const authUserId = requireUser(req)._id
    const chatPartnerId = validateObjectId(req.params.userId)

    const { cursor, limit = 20 } = getMessagesQuerySchema.parse(req.query)

    const messages = await getMessagesWithUserService({
      authUserId,
      chatPartnerId,
      cursor: cursor ? new Date(cursor) : null,
      limit: Math.min(Number(limit), 100),
    })

    res.status(200).json({ success: true, data: messages })
  } catch (error) {
    handleError(error, res)
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const authUserId = requireUser(req)._id
    const receiverId = validateObjectId(req.params.receiverId)

    const parsed = messageContentSchema.parse(req.body)

    const sanitizedText = parsed.text
      ? sanitizeHtml(parsed.text, {
          allowedAttributes: {},
          allowedTags: [],
        }).trim()
      : undefined

    const message = await sendMessageService({
      authUserId,
      receiverId,
      messageData: {
        text: sanitizedText,
        image: parsed.image,
      },
    })

    res.status(201).json({ success: true, data: sanitizeMessage(message) })
  } catch (error) {
    handleError(error, res)
  }
}
