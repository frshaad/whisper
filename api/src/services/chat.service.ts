import type { Types } from 'mongoose'

import type { ChatListItem } from '@/lib/types'
import { Message } from '@/models/message.model'

export async function getChatsListService(
  authUserId: Types.ObjectId,
): Promise<ChatListItem[]> {
  const chats = await Message.aggregate<ChatListItem>([
    {
      $match: {
        $or: [{ senderId: authUserId }, { receiverId: authUserId }],
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', authUserId] },
            '$receiverId',
            '$senderId',
          ],
        },
        lastMessageCreatedAt: { $max: '$createdAt' },
        lastMessageText: { $last: '$text' },
        lastMessageImage: { $last: '$image' },
        lastMessageReadStatus: { $last: '$readStatus' },
        lastMessageId: { $last: '$_id' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$user._id',
        fullname: '$user.fullname',
        username: '$user.username',
        profileImage: '$user.profileImage',
        lastMessageText: 1,
        lastMessageImage: 1,
        lastMessageCreatedAt: 1,
        lastMessageReadStatus: 1,
      },
    },
    {
      $sort: { lastMessageCreatedAt: -1 },
    },
  ])

  return chats
}
