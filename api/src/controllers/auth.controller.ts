import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import { generateToken, sanitizeUser, verifyPassword } from '@/lib/utils'
import { passwordSchema } from '@/lib/zod-schemas'
import {
  changePasswordSchema,
  loginInputsSchema,
  signupInputsSchema,
} from '@/lib/zod-schemas/auth.zod'
import type { UserDoc } from '@/models/user.model'
import {
  changePasswordService,
  deleteAccountService,
  loginService,
  signupService,
} from '@/services/auth.service'

export async function signUp(req: Request, res: Response) {
  try {
    const parsedInputs = signupInputsSchema.parse(req.body)
    const user = await signupService(parsedInputs)
    generateToken(user._id, res)

    res.status(201).json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    const parsedInputs = loginInputsSchema.parse(req.body)
    const user = await loginService(parsedInputs)

    generateToken(user._id, res)

    res.status(200).json({ success: true, data: sanitizeUser(user) })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logOut(req: Request, res: Response) {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res
      .status(200)
      .json({ success: true, message: 'User logged out Successfully' })
  } catch (error) {
    handleError(error, res)
  }
}

export async function getMyProfile(req: Request, res: Response) {
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

export async function changePassword(req: Request, res: Response) {
  try {
    const { password } = changePasswordSchema.parse(req.body)
    const user = req.user
    if (!user) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    await changePasswordService(password, user)

    res.status(200).json({ success: true })
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

    res.clearCookie('token')
    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}
