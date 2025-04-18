import { Router } from 'express'

import { logIn, logOut, signUp } from '@/controllers/auth.controller'
import { authLimiter } from '@/middlewares/rateLimiter'

const router = Router()

router.use(authLimiter) // Apply rate limiting to all auth routes

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/logout', logOut)

export default router
