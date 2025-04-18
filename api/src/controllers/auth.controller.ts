/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from 'express'

import { handleError } from '@/lib/errors'
import { generateToken } from '@/lib/utils'
import { loginInputsSchema, signupInputsSchema } from '@/lib/zod-schemas'
import { loginService, signupService } from '@/services/auth.services'

export async function signUp(req: Request, res: Response) {
  try {
    const parsedInputs = signupInputsSchema.parse(req.body)
    const user = await signupService(parsedInputs)
    generateToken(user._id, res)

    const { password, __v, ...userWithoutPassword } = user.toObject()
    res.status(201).json({ status: 'success', user: userWithoutPassword })
  } catch (error) {
    handleError(error, res)
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    const parsedInputs = loginInputsSchema.parse(req.body)
    const user = await loginService(parsedInputs)
    generateToken(user._id, res)

    const { password, __v, ...userWithoutPassword } = user.toObject()
    res.status(200).json({ status: 'success', user: userWithoutPassword })
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
