import type { Types } from 'mongoose'

import type { UserType } from '../../schemas/user.schema'

declare global {
  namespace Express {
    export interface Request {
      user?: UserType
      userId?: Types.ObjectId
    }
  }
}

export {}
