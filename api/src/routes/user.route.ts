import { Router } from 'express'

import {
  deleteAccount,
  updateUserInfo,
  uploadProfilePic,
} from '@/controllers/user.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.put('/update-info', updateUserInfo)
router.put('/update-profile-pic', uploadProfilePic)
router.post('/delete-account', deleteAccount)

export default router
