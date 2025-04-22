import { AppError } from '@/lib/errors'
import { comparePasswords, hashPassword, sanitizeUser } from '@/lib/utils'
import { User, type UserDoc } from '@/models/user.model'

type LoginInputs = {
  username: string
  password: string
}

type SignupInputs = LoginInputs & {
  fullname: string
}

export async function signupService({
  username,
  fullname,
  password: inputPassword,
}: SignupInputs) {
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    throw new AppError(400, 'Username is already taken')
  }

  const hashedPassword = await hashPassword(inputPassword)
  const user = await User.create({
    username,
    fullname,
    password: hashedPassword,
  })

  return sanitizeUser(user)
}

export async function loginService({
  username,
  password: inputPassword,
}: LoginInputs) {
  const user = await User.findOne({ username })
  if (!user) {
    throw new AppError(400, 'User does not exist')
  }

  const isPasswordCorrect = await comparePasswords(inputPassword, user.password)
  if (!isPasswordCorrect) {
    throw new AppError(400, 'Invalid credentials')
  }

  return sanitizeUser(user)
}

export async function changePasswordService(
  newPassword: string,
  user: UserDoc,
) {
  const isSamePassword = await comparePasswords(newPassword, user.password)
  if (isSamePassword) {
    throw new AppError(
      400,
      'New password cannot be the same as the old password.',
    )
  }

  const hashedPassword = await hashPassword(newPassword)

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    },
    { new: true },
  )

  if (!updatedUser) {
    throw new AppError(404, 'User not found')
  }
}
