import type { Request, Response } from 'express'

import { handleError } from '@/lib/errors'
import {
  generateToken,
  requireUser,
  sanitizeUser,
  verifyPassword,
} from '@/lib/utils'
import {
  changePasswordSchema,
  loginInputsSchema,
  signupInputsSchema,
} from '@/lib/zod-schemas/auth.zod'
import {
  changePasswordService,
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

export async function changePassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body,
    )

    const user = requireUser(req)

    await verifyPassword(user._id, currentPassword)

    await changePasswordService(newPassword, user)

    res.status(200).json({ success: true })
  } catch (error) {
    handleError(error, res)
  }
}
