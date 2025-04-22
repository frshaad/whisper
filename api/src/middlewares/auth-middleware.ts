import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { env } from '@/lib/env'
import { AppError, handleError } from '@/lib/errors'
import { User } from '@/models/user.model'

interface DecodedToken extends JwtPayload {
  userId: string
  iat: number
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.jwt
    if (!token) {
      throw new AppError(401, 'Access denied. No token provided.')
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken
    if (!decoded || !decoded.userId) {
      throw new AppError(401, 'Access denied. Invalid token.')
    }

    const user = await User.findById(decoded.userId).select('+password')
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    if (
      user.passwordChangedAt &&
      decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      throw new AppError(401, 'Access denied. Password was changed recently.')
    }

    req.userId = user._id
    req.user = user

    next()
  } catch (error) {
    handleError(error, res)
  }
}
