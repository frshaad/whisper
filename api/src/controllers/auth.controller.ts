import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import { generateToken } from '@/lib/utils'
import {
  loginInputsSchema,
  signupInputsSchema,
  updateProfileInputSchema,
} from '@/lib/zod-schemas'
import {
  loginService,
  signupService,
  updateProfileService,
} from '@/services/auth.service'

export async function signUp(req: Request, res: Response) {
  try {
    const parsedInputs = signupInputsSchema.parse(req.body)
    const user = await signupService(parsedInputs)
    generateToken(user._id, res)

    res.status(201).json({ status: 'success', user })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    const parsedInputs = loginInputsSchema.parse(req.body)
    const user = await loginService(parsedInputs)
    generateToken(user._id, res)

    res.status(200).json({ status: 'success', user })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logOut(req: Request, res: Response) {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res
      .status(200)
      .json({ status: 'success', message: 'User logged out Successfully' })
  } catch (error) {
    handleError(error, res)
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const parsedInputs = updateProfileInputSchema.parse(req.body)
    const userId = req.user?._id
    if (!userId) {
      throw new AppError(401, 'Access denied. User not found.')
    }

    const user = await updateProfileService(parsedInputs, userId)

    res.status(200).json({ status: 'success', user })
  } catch (error) {
    handleError(error, res)
  }
}
