import type { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import { comparePasswords, hashPassword, sanitizeUser } from '@/lib/utils'
import { User, type UserType } from '@/models/user.model'

type LoginInputs = {
  email: string
  password: string
}

type SignupInputs = LoginInputs & {
  fullname: string
}

type UpdateProfileInputs = {
  profilePic?: string
  fullname?: string
}

export async function signupService({
  email,
  fullname,
  password: inputPassword,
}: SignupInputs) {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError(400, 'Email is already in use')
  }

  const hashedPassword = await hashPassword(inputPassword)
  const user = await User.create({
    email,
    fullname,
    password: hashedPassword,
  })

  return sanitizeUser(user)
}

export async function loginService({
  email,
  password: inputPassword,
}: LoginInputs) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(400, 'User does not exist')
  }

  const isPasswordCorrect = await comparePasswords(inputPassword, user.password)
  if (!isPasswordCorrect) {
    throw new AppError(400, 'Invalid credentials')
  }

  return sanitizeUser(user)
}

export async function updateProfileService(
  inputs: UpdateProfileInputs,
  userId: Types.ObjectId,
) {
  const { fullname, profilePic } = inputs

  const updatedFields: Partial<UserType> = {}

  if (profilePic) {
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    updatedFields.profilePic = uploadResponse.secure_url
  }

  if (fullname) {
    updatedFields.fullname = fullname
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedFields },
    { new: true },
  )

  if (!updatedUser) {
    throw new AppError(404, 'User not found')
  }

  return sanitizeUser(updatedUser)
}
