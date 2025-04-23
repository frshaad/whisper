import { Router } from 'express'

import { getUserProfile } from '@/controllers/auth.controller'
import {
  deleteAccount,
  updateUserInfo,
  uploadProfilePic,
} from '@/controllers/user.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/profile', getUserProfile)
router.put('/profile', updateUserInfo)
router.put('/profile-picture', uploadProfilePic)
router.post('/delete-account', deleteAccount)

export default router
