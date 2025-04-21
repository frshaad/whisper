import { Router } from 'express'

import { checkAuth, logIn, logOut, signUp } from '@/controllers/auth.controller'
import authMiddleware from '@/middlewares/auth-middleware'
import { authLimiter } from '@/middlewares/rateLimiter'

const router = Router()

router.use(authLimiter) // Apply rate limiting to all auth routes

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/logout', logOut)

router.get('/check', authMiddleware, checkAuth)

export default router
