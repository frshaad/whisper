import { Router } from 'express'

import { getAllMessagesWithUser } from '@/controllers/message.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.get('/:id', authMiddleware, getAllMessagesWithUser)

export default router
