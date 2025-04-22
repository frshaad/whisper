import { Router } from 'express'

import {
  changePassword,
  getMyProfile,
  logIn,
  logOut,
  signUp,
} from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth-middleware'
import { authLimiter } from '@/middlewares/rateLimiter'

const router = Router()

router.post('/login', authLimiter, logIn)
router.post('/signup', authLimiter, signUp)
router.post('/logout', logOut)

router.use(authMiddleware)

router.get('/me', getMyProfile)
router.post('/change-password', changePassword)

export default router
