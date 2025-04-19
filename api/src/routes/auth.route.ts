import { Router } from 'express'

import {
  logIn,
  logOut,
  signUp,
  updateProfile,
} from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth-middleware'
import { authLimiter } from '@/middlewares/rateLimiter'

const router = Router()

router.use(authLimiter) // Apply rate limiting to all auth routes

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/logout', logOut)

router.put('/update-profile', authMiddleware, updateProfile)

export default router
