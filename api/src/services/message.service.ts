import { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { type CreateMessageInput } from '@/lib/zod-schemas/message.zod'
import { Message } from '@/models/message.model'

type ChatHistoryParams = {
  authUserId: Types.ObjectId
  chatPartnerId: Types.ObjectId
  cursor: Date | null
  limit: number
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
