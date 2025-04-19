import type { UserTypeWithId } from '@/models/user.model'

declare global {
  namespace Express {
    export interface Request {
      user?: UserTypeWithId
    }
  }
}

export {}
