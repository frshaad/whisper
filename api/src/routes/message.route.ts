import { Router } from 'express'

import {
  getMessagesWithUser,
  sendMessage,
} from '@/controllers/message.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/:userId', getMessagesWithUser)
router.post('/:receiverId', sendMessage)
// router.delete('/:messageId', deleteMessage)

export default router
