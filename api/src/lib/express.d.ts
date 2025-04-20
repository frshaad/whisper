import type { Types } from 'mongoose'

import type { UserType } from '@/models/user.model'

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId
      user?: UserType
    }
  }
}

export {}
