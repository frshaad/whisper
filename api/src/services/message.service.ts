import { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import { validateId } from '@/lib/utils'
import { messageSchema } from '@/lib/zod-schemas/message.zod'
import { Message } from '@/models/message.model'

export async function getChatHistoryService(
  userIdString: string,
  authUserId: Types.ObjectId | undefined,
) {
  if (!authUserId) {
    throw new AppError(401, 'Access denied. Invalid token.')
  }

  const otherPartyUserId = validateId(userIdString)

  return await Message.find({
    $or: [
      { senderId: authUserId, receiverId: otherPartyUserId },
      { senderId: otherPartyUserId, receiverId: authUserId },
    ],
  })
}

export async function sendMessageService(
  receiverIdString: string,
  authUserId: Types.ObjectId | undefined,
  messageData: unknown,
) {
  if (!authUserId) {
    throw new AppError(401, 'Access denied. Invalid token.')
  }

  const receiverId = validateId(receiverIdString)
  const { image, text } = messageSchema.parse(messageData)

  let imageUrl: string | undefined
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image)
    imageUrl = uploadResponse.secure_url
  }

  const newMessage = await Message.create({
    senderId: authUserId,
    receiverId,
    text,
    image: imageUrl,
  })

  // Realtime functionality => socket.io

  return newMessage
}
