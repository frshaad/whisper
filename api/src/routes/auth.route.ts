import { Router } from 'express'

import { logIn, logOut, signUp } from '@/controllers/auth.controller'

const router = Router()

router.post('/login', logIn)
router.post('/signup', signUp)
router.post('/logout', logOut)

export default router
