import { Router } from 'express'

import { getChatsList } from '@/controllers/chat.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', getChatsList)

export default router
