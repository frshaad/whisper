import { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import type { MessageContent } from '@/lib/zod-schemas/message.zod'
import { Message } from '@/models/message.model'

type ChatHistoryParams = {
  authUserId: Types.ObjectId
  chatPartnerId: Types.ObjectId
  cursor: Date | null
  limit: number
}

type SendMessageParams = {
  authUserId: Types.ObjectId
  receiverId: Types.ObjectId
  messageData: MessageContent
}

export async function getMessagesWithUserService({
  authUserId,
  chatPartnerId,
  cursor,
  limit,
}: ChatHistoryParams) {
  const filter = {
    $or: [
      { senderId: authUserId, receiverId: chatPartnerId },
      { senderId: chatPartnerId, receiverId: authUserId },
    ],
    ...(cursor && { createdAt: { $lt: cursor } }),
  }

  return await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('text image senderId receiverId createdAt readStatus _id')
    .lean()
}

export async function sendMessageService({
  authUserId,
  receiverId,
  messageData,
}: SendMessageParams) {
  let imageUrl: string | undefined

  if (messageData.image) {
    const uploadResponse = await cloudinary.uploader.upload(messageData.image)
    imageUrl = uploadResponse.secure_url
  }

  const newMessage = await Message.create({
    senderId: authUserId,
    receiverId,
    text: messageData.text,
    image: imageUrl,
  })

  // Realtime functionality => socket.io

  return newMessage
}
