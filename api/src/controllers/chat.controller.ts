import type { Request, Response } from 'express'

import { handleError } from '@/lib/errors'
import { requireUser, sanitizeChatListItem } from '@/lib/utils'
import { getChatsListService } from '@/services/chat.service'

export async function getChatsList(req: Request, res: Response) {
  try {
    const authUserId = requireUser(req)._id

    const chats = await getChatsListService(authUserId)

    res
      .status(200)
      .json({ success: true, data: chats.map(sanitizeChatListItem) })
  } catch (error) {
    handleError(error, res)
  }
}
