import { Router } from 'express'

import { updateUserInfo } from '@/controllers/user.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.put('/update-info', updateUserInfo)
router.put('/update-profile-pic', updateUserInfo)

export default router
