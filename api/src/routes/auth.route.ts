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

router.use(authLimiter) // Apply rate limiting to all auth routes

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/logout', logOut)

router.use(authMiddleware)

router.get('/me', getMyProfile)
router.get('/change-password', changePassword)

export default router
