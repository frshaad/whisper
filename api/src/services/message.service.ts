import { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { type CreateMessageInput } from '@/lib/zod-schemas/message.zod'
import { Message } from '@/models/message.model'

export async function getChatHistoryService(
  userId: Types.ObjectId,
  authUserId: Types.ObjectId,
) {
  return await Message.find({
    $or: [
      { senderId: authUserId, receiverId: userId },
      { senderId: userId, receiverId: authUserId },
    ],
  })
}

export async function sendMessageService(
  receiverId: Types.ObjectId,
  authUserId: Types.ObjectId,
  messageData: CreateMessageInput,
) {
  const { image, text } = messageData

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
