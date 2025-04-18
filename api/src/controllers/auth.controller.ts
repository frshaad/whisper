/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response } from 'express'

import { AppError } from '@/lib/errors'
import { generateToken } from '@/lib/utils'
import { signupInputsSchema } from '@/lib/zod-schemas'
import { signupService } from '@/services/auth.services'

export async function signUp(req: Request, res: Response) {
  try {
    const parsedInputs = signupInputsSchema.parse(req.body)
    const user = await signupService(parsedInputs)
    generateToken(user._id, res)

    const { password, ...userWithoutPassword } = user.toObject()
    res.status(201).json({ status: 'success', user: userWithoutPassword })
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'failed',
        message: error.message,
        ...(error.errors && { errors: error.errors }),
      })
    } else {
      res.status(500).json({
        status: 'failed',
        message: 'Something went wrong. Please try again later.',
      })
    }
  }
}

export async function logIn(req: Request, res: Response) {
  res.send('Login Route')
}

export async function logOut(req: Request, res: Response) {
  res.send('Login Route')
}
