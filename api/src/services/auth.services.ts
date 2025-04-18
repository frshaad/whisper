import { AppError } from '@/lib/errors'
import { comparePasswords, hashPassword } from '@/lib/utils'
import { User } from '@/models/user.model'

type LoginInputs = {
  email: string
  password: string
}

type SignupInputs = LoginInputs & {
  fullname: string
}

export async function signupService({
  email,
  fullname,
  password,
}: SignupInputs) {
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
}

export async function loginService({ email, password }: LoginInputs) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(400, 'User does not exist')
  }

  const isPasswordCorrect = await comparePasswords(password, user.password)
  if (!isPasswordCorrect) {
    throw new AppError(400, 'Invalid credentials')
  }

  return user
}
