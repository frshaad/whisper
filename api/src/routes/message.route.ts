import { Router } from 'express'

import {
  deleteMessage,
  getMessagesWithUser,
  sendMessage,
} from '@/controllers/message.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/:userId', getMessagesWithUser)
router.post('/:receiverId', sendMessage)
router.delete('/:messageId', deleteMessage)

export default router
