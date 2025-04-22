import bcrypt from 'bcryptjs'
import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

import { env } from '@/lib/env'
import { AppError } from '@/lib/errors'
import type {
  MinimalUser,
  PublicProfileUser,
  SafeUser,
  SafeUserWithToken,
} from '@/lib/types'
import type { UserDoc } from '@/models/user.model'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(env.HASH_SALT_FACTOR)
  return await bcrypt.hash(password, salt)
}

export async function comparePasswords(
  candidatePassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(candidatePassword, hashedPassword)
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

export function validateId(
  input: string | number | Types.ObjectId,
): Types.ObjectId {
  if (!Types.ObjectId.isValid(input)) {
    throw new AppError(400, 'Invalid user ID')
  }
  const parsedId = new Types.ObjectId(input)
  return parsedId
}

export function sanitizeUser(user: UserDoc): SafeUser {
  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    profilePic: user.profilePic,
    bio: user.bio,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function sanitizeUserMinimal(user: UserDoc): MinimalUser {
  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    profilePic: user.profilePic,
    isOnline: user.isOnline,
  }
}

export function sanitizeUserProfile(user: UserDoc): PublicProfileUser {
  return {
    id: user._id.toString(),
    username: user.username,
    fullname: user.fullname,
    bio: user.bio,
    profilePic: user.profilePic,
    lastSeen: user.lastSeen,
    isOnline: user.isOnline,
  }
}

export function sanitizeUserWithToken(
  user: UserDoc,
  token: string,
): SafeUserWithToken {
  return {
    ...sanitizeUser(user),
    token,
  }
}
