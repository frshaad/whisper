import type { Request, Response } from 'express'

import { handleError } from '@/lib/errors'
import { generateToken } from '@/lib/utils'
import {
  loginInputsSchema,
  signupInputsSchema,
} from '@/lib/zod-schemas/auth.zod'
import { loginService, signupService } from '@/services/auth.service'

export async function signUp(req: Request, res: Response) {
  try {
    const parsedInputs = signupInputsSchema.parse(req.body)
    const user = await signupService(parsedInputs)
    generateToken(user._id, res)

    res.status(201).json({ success: true, data: user })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    const parsedInputs = loginInputsSchema.parse(req.body)
    const user = await loginService(parsedInputs)
    generateToken(user._id, res)

    res.status(200).json({ success: true, data: user })
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

export async function checkAuth(req: Request, res: Response) {
  try {
    res.status(200).json({ success: true, data: req.user })
  } catch (error) {
    handleError(error, res)
  }
}
