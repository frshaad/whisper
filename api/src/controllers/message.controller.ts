import type { Request, Response } from 'express'

import { handleError } from '@/lib/errors'
import { getChatHistoryService } from '@/services/message.service'

export async function getAllMessagesWithUser(req: Request, res: Response) {
  try {
    const { id: otherPartyUserId } = req.params
    const userId = req.userId
    const messages = await getChatHistoryService(otherPartyUserId, userId)
    res.status(200).json(messages)
  } catch (error) {
    handleError(error, res)
  }
}
