import { AppError } from '@/lib/errors'
import { User, type UserDoc } from '@/models/user.model'

type LoginInputs = Pick<UserDoc, 'username' | 'password'>
type SignupInputs = Pick<UserDoc, 'username' | 'password' | 'fullname'>

export async function signupService({
  username,
  fullname,
  password,
}: SignupInputs) {
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    throw new AppError(400, 'Username is already taken')
  }

  const user = await User.create({
    username,
    fullname,
    password,
  })

  return user
}

export async function loginService({ username, password }: LoginInputs) {
  const user = await User.findOne({ username }).select('+password')
  if (!user) {
    throw new AppError(400, 'User does not exist')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new AppError(400, 'Invalid credentials')
  }

  return user
}

export async function changePasswordService(
  newPassword: string,
  user: UserDoc,
) {
  const isSamePassword = await user.comparePassword(newPassword)
  if (isSamePassword) {
    throw new AppError(
      400,
      'New password cannot be the same as the old password.',
    )
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        password: newPassword,
        passwordChangedAt: new Date(),
      },
    },
    { new: true },
  ).select('+password')

  if (!updatedUser) {
    throw new AppError(404, 'User not found')
  }
}
