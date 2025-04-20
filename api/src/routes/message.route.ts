import { Router } from 'express'

import {
  getAllMessagesWithUser,
  sendMessage,
} from '@/controllers/message.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/:id', getAllMessagesWithUser)
router.post('/send/:id', sendMessage)

export default router
