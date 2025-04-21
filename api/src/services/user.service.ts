import type { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import { sanitizeUser } from '@/lib/utils'
import { User, type UserType } from '@/models/user.model'

type UpdateProfileInputs = {
  profilePic?: string
  fullname?: string
}

export async function updateUserInfoService(
  inputs: UpdateProfileInputs,
  userId: Types.ObjectId | undefined,
) {
  if (!userId) {
    throw new AppError(401, 'Access denied. User not found.')
  }

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
