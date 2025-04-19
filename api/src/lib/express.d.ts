import type { Types } from 'mongoose'

import type { UserTypeWithId } from '@/models/user.model'

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId
      user?: UserTypeWithId
    }
  }
}

export {}
