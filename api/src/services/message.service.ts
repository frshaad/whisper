import { Types } from 'mongoose'

import { AppError } from '@/lib/errors'
import { Message } from '@/models/message.model'

export async function getChatHistoryService(
  userIdString: string,
  authUserId: Types.ObjectId | undefined,
) {
  if (authUserId) {
    throw new AppError(401, 'Access denied. Invalid token.')
  }

  if (!Types.ObjectId.isValid(userIdString)) {
    throw new AppError(400, 'Invalid user ID')
  }

  const otherPartyUserId = new Types.ObjectId(userIdString)

  return await Message.find({
    $or: [
      { senderId: authUserId, receiverId: otherPartyUserId },
      { senderId: otherPartyUserId, receiverId: authUserId },
    ],
  })
}
