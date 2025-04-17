import type { Request, Response } from 'express'

import { generateToken, hashPassword } from '@/lib/utils'
import { signupInputsSchema } from '@/lib/zod-schemas'
import { User } from '@/models/user.model'

export async function signupService(req: Request, res: Response) {
  const parsedInputs = signupInputsSchema.safeParse(req.body)
  if (!parsedInputs.success) {
    throw new Error('Sign Up inputs are invalid.')
  }

  const { email, fullname, password } = parsedInputs.data

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('Email is Already in use.')
  }

  const hashedPassword = await hashPassword(password)
  const newUser = await User.create({
    email,
    fullname,
    password: hashedPassword,
  })

  generateToken(newUser._id, res)

  return newUser
}
