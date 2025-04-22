import type { Types } from 'mongoose'

import type { UserDoc } from '@/models/user.model'

declare global {
  namespace Express {
    export interface Request {
      userId?: Types.ObjectId
      user?: UserDoc
    }
  }
}

export {}
