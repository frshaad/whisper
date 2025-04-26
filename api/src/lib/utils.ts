import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { isValidObjectId, Types } from 'mongoose'

import { env } from '@/lib/env'
import { AppError } from '@/lib/errors'
import type { ChatListItem, SafeUser, SanitizedMessage } from '@/lib/types'
import type { MessageDoc } from '@/models/message.model'
import { User, type UserDoc } from '@/models/user.model'

export function requireUser(req: Request): UserDoc {
  if (!req.user) {
    throw new AppError(401, 'Access denied. User not found.')
  }
  return req.user
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(env.HASH_SALT_FACTOR)
  return await bcrypt.hash(password, salt)
}

export async function verifyPassword(
  userId: Types.ObjectId,
  inputPassword: string,
) {
  const user = await User.findById(userId).select('+password')
  if (!user || !(await user.comparePassword(inputPassword))) {
    throw new AppError(401, 'Incorrect password')
  }
}

export function generateToken(userId: Types.ObjectId, res: Response) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '30d',
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: env.NODE_ENV == 'production' ? 'none' : 'lax',
    secure: env.NODE_ENV == 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })
}

export function validateObjectId(input: unknown): Types.ObjectId {
  if (
    typeof input == 'string' ||
    typeof input == 'number' ||
    input instanceof Types.ObjectId
  ) {
    if (!isValidObjectId(input)) {
      throw new AppError(400, 'Invalid ID')
    }

    return input instanceof Types.ObjectId ? input : new Types.ObjectId(input)
  }

  throw new AppError(400, 'ID must be a valid string or ObjectId')
}

export function sanitizeUser(user: UserDoc): SafeUser {
  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    profilePic: user.profilePic,
    bio: user.bio,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

// export function sanitizeUserMinimal(user: UserDoc): MinimalUser {
//   return {
//     id: user._id.toString(),
//     username: user.username,
//     fullname: user.fullname,
//     profilePic: user.profilePic,
//   }
// }

// export function sanitizeUserProfile(user: UserDoc): PublicProfileUser {
//   return {
//     id: user._id.toString(),
//     username: user.username,
//     fullname: user.fullname,
//     bio: user.bio,
//     profilePic: user.profilePic,
//     lastSeen: user.lastSeen,
//   }
// }

// export function sanitizeUserWithToken(
//   user: UserDoc,
//   token: string,
// ): SafeUserWithToken {
//   return {
//     ...sanitizeUser(user),
//     token,
//   }
// }

export function sanitizeMessage(message: MessageDoc): SanitizedMessage {
  return {
    _id: message._id.toString(),
    senderId: message.senderId.toString(),
    receiverId: message.receiverId.toString(),
    text: message.text,
    image: message.image,
    readStatus: message.readStatus,
    createdAt: message.createdAt,
  }
}

export function sanitizeChatListItem(chat: ChatListItem) {
  return {
    userId: chat.userId.toString(),
    fullname: chat.fullname,
    username: chat.username,
    profileImage: chat.profileImage || null,
    lastMessageText: chat.lastMessageText || null,
    lastMessageImage: chat.lastMessageImage || null,
    lastMessageCreatedAt: chat.lastMessageCreatedAt,
    lastMessageReadStatus: chat.lastMessageReadStatus,
  }
}
