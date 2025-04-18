import bcrypt from 'bcryptjs'
import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Types } from 'mongoose'

import { env } from '@/lib/env'

export async function hashPassword(password: string): Promise<string> {
  const saltFactor = env.HASH_SALT_FACTOR
  const salt = await bcrypt.genSalt(saltFactor)
  return await bcrypt.hash(password, salt)
}

export async function comparePasswords(
  candidatePassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(candidatePassword, hashedPassword)
}

export function generateToken(id: Types.ObjectId, res: Response) {
  const token = jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: '30d',
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: env.NODE_ENV == 'production' ? 'none' : 'lax',
    secure: env.NODE_ENV == 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })
}
