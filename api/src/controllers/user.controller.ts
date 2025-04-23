import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import { sanitizeUser, verifyPassword } from '@/lib/utils'
import { passwordSchema } from '@/lib/zod-schemas'
import {
  updateProfilePicSchema,
  updateUserInfoSchema,
} from '@/lib/zod-schemas/user.zod'
import type { UserDoc } from '@/models/user.model'
import { deleteAccountService } from '@/services/auth.service'
import {
  getAllContactsService,
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
    const user = req.user
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    const updatedUser = await updateProfilePicService(profilePic, user)

    res.status(200).json({ success: true, data: sanitizeUser(updatedUser) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const user = req.user
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

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

export async function getAllContacts(req: Request, res: Response) {
  try {
    const user = req.user
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    const contacts = await getAllContactsService(user._id)
    res.status(200).json({ success: true, data: contacts })
  } catch (error) {
    handleError(error, res)
  }
}
