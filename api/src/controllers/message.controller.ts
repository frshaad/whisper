import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import { requireUser, validateObjectId } from '@/lib/utils'
import {
  createMessageSchema,
  getMessagesSchema,
} from '@/lib/zod-schemas/message.zod'
import {
  getMessagesWithUserService,
  sendMessageService,
} from '@/services/message.service'

export async function getMessagesWithUser(req: Request, res: Response) {
  try {
    const authUserId = requireUser(req)._id
    const chatPartnerId = validateObjectId(req.params.id)

    const { cursor, limit = 20 } = getMessagesSchema.parse(req.query)

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
    const otherPartyUserId = validateObjectId(req.params.id)
    const userId = req.userId
    if (!userId) {
      throw new AppError(404, 'Access denied. Invalid token.')
    }
    const parsedMessageData = createMessageSchema.parse(req.body)

    const message = await sendMessageService(
      otherPartyUserId,
      userId,
      parsedMessageData,
    )
    res.status(200).json({ success: true, data: message })
  } catch (error) {
    handleError(error, res)
  }
}
