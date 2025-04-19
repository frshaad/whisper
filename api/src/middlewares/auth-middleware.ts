import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { env } from '@/lib/env'
import { AppError, handleError } from '@/lib/errors'
import { User } from '@/models/user.model'

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

    const decodedToken = jwt.verify(token, env.JWT_SECRET)
    if (!decodedToken) {
      throw new AppError(401, 'Access denied. Invalid token.')
    }

    if (typeof decodedToken == 'object' && 'userId' in decodedToken) {
      req.userId = (decodedToken as JwtPayload).userId
    } else {
      throw new AppError(401, 'Access denied. Invalid token.')
    }

    const user = await User.findById(decodedToken.userId).select('-password')
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    req.user = user
    next()
  } catch (error) {
    handleError(error, res)
  }
}
