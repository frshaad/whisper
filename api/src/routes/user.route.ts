import { Router } from 'express'

import {
  addContact,
  blockUser,
  deleteAccount,
  getAllContacts,
  getBlockedUsers,
  getUserProfile,
  removeContact,
  searchUser,
  unblockUser,
  updateUserInfo,
  uploadProfilePic,
} from '@/controllers/user.controller'
import authMiddleware from '@/middlewares/auth-middleware'

const router = Router()

router.use(authMiddleware)

router.get('/search', searchUser)

router.get('/profile', getUserProfile)
router.put('/profile', updateUserInfo)
router.put('/profile-picture', uploadProfilePic)

router.get('/contacts', getAllContacts)
router.post('/contacts/:userId', addContact)
router.delete('/contacts/:userId', removeContact)

router.get('/blocked', getBlockedUsers)
router.post('/block/:userId', blockUser)
router.delete('/block/:userId', unblockUser)

router.post('/delete-account', deleteAccount)

export default router
