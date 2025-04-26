import type { Types } from 'mongoose'

export type MinimalUser = {
  id: string
  username: string
  fullname: string
  profilePic: string
}

export type PublicProfileUser = MinimalUser & {
  lastSeen: Date | null
  bio: string
}

export type SafeUser = PublicProfileUser & {
  createdAt: Date
  updatedAt: Date
}

// export type SafeUserWithToken = SafeUser & {
//   token: string
// }

export type SanitizedMessage = {
  _id: string
  senderId: string
  receiverId: string
  text?: string | null
  image?: string | null
  readStatus: boolean
  createdAt: Date
}

export type ChatListItem = {
  userId: Types.ObjectId
  fullname: string
  username: string
  profileImage?: string
  lastMessageText?: string
  lastMessageImage?: string
  lastMessageCreatedAt: Date
  lastMessageReadStatus: boolean
}
