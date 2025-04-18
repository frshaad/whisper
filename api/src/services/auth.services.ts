import { ZodError } from 'zod'

import { AppError } from '@/lib/errors'
import { hashPassword } from '@/lib/utils'
import { User } from '@/models/user.model'

type SignupInputs = {
  email: string
  fullname: string
  password: string
}

export async function signupService({
  email,
  fullname,
  password,
}: SignupInputs) {
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError(400, 'Email is already in use')
    }

    const hashedPassword = await hashPassword(password)
    return await User.create({
      email,
      fullname,
      password: hashedPassword,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        400,
        'Invalid input',
        error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      )
    }

    throw error
  }
}
