import type { Request, Response } from 'express'
import { ZodError } from 'zod'

import { AppError } from '@/lib/errors'
import { generateToken, hashPassword } from '@/lib/utils'
import { signupInputsSchema } from '@/lib/zod-schemas'
import { User } from '@/models/user.model'

export async function signupService(req: Request, res: Response) {
  try {
    const { email, fullname, password } = signupInputsSchema.parse(req.body)

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError(400, 'Email is already in use')
    }

    const hashedPassword = await hashPassword(password)
    const newUser = await User.create({
      email,
      fullname,
      password: hashedPassword,
    })

    generateToken(newUser._id, res)
    return newUser
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        400,
        'Validation failed',
        error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      )
    }

    throw error
  }
}
