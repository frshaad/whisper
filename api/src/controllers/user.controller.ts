import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import {
  requireUser,
  sanitizeUser,
  validateId,
  verifyPassword,
} from '@/lib/utils'
import { passwordSchema } from '@/lib/zod-schemas'
import {
  searchUserQuerySchema,
  updateProfilePicSchema,
  updateUserInfoSchema,
} from '@/lib/zod-schemas/user.zod'
import type { UserDoc } from '@/models/user.model'
import { deleteAccountService } from '@/services/auth.service'
import {
  addContactService,
  blockUserService,
  getAllContactsService,
  getBlockedUsersService,
  removeContactService,
  searchQueryService,
  unblockUserService,
  updateProfilePicService,
  updateUserInfoService,
} from '@/services/user.service'

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { user } = req
    if (!user) {
      throw new AppError(400, 'User does not exist')
    }

    res.status(200).json({ success: true, data: sanitizeUser(user as UserDoc) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function updateUserInfo(req: Request, res: Response) {
  try {
    const parsedInputs = updateUserInfoSchema.parse(req.body)
    const userId = req.userId
    if (!userId) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    const user = await updateUserInfoService(parsedInputs, userId)

    res.status(200).json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function uploadProfilePic(req: Request, res: Response) {
  try {
    const { profilePic } = updateProfilePicSchema.parse(req.body)
    const user = requireUser(req)

    const updatedUser = await updateProfilePicService(profilePic, user)

    res.status(200).json({ success: true, data: sanitizeUser(updatedUser) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const user = requireUser(req)

    const { password } = req.body
    const parsedPassword = passwordSchema.parse(password)
    await verifyPassword(user._id, parsedPassword)

    await deleteAccountService(user._id)

    res.clearCookie('jwt')
    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}

// =====================
// ===== Contacts ======
// =====================
export async function getAllContacts(req: Request, res: Response) {
  try {
    const user = requireUser(req)

    const contacts = await getAllContactsService(user._id)
    res.status(200).json({ success: true, data: contacts })
  } catch (error) {
    handleError(error, res)
  }
}

export async function addContact(req: Request, res: Response) {
  try {
    const constactId = validateId(req.params.userId)
    const user = requireUser(req)

    await addContactService(user._id, constactId)

    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}

export async function removeContact(req: Request, res: Response) {
  try {
    const constactId = validateId(req.params.userId)
    const user = requireUser(req)

    await removeContactService(user._id, constactId)

    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}

// ==========================
// ===== Blocked Users ======
// ==========================
export async function getBlockedUsers(req: Request, res: Response) {
  try {
    const user = requireUser(req)

    const blockedUsers = await getBlockedUsersService(user._id)
    res.status(200).json({ success: true, data: blockedUsers })
  } catch (error) {
    handleError(error, res)
  }
}

export async function blockUser(req: Request, res: Response) {
  try {
    const targetUserId = validateId(req.params.userId)
    const user = requireUser(req)

    await blockUserService(user._id, targetUserId)

    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}

export async function unblockUser(req: Request, res: Response) {
  try {
    const targetUserId = validateId(req.params.userId)
    const user = requireUser(req)

    await unblockUserService(user._id, targetUserId)

    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}

// ========================
// ===== Search User ======
// ========================
export async function searchUser(req: Request, res: Response) {
  try {
    const parsedQuery = searchUserQuerySchema.parse(req.query)

    const searchResults = await searchQueryService(parsedQuery)

    res.status(200).json({
      success: true,
      data: searchResults,
    })
  } catch (error) {
    handleError(error, res)
  }
}
