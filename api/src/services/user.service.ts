import type { Types } from 'mongoose'

import { AppError } from '@/lib/errors'
import { sanitizeUser } from '@/lib/utils'
import type { UpdateUserInfoObj } from '@/lib/zod-schemas/user.zod'
import { User, type UserType } from '@/models/user.model'

export async function updateUserInfoService(
  inputs: UpdateUserInfoObj,
  userId: Types.ObjectId,
) {
  const { fullname } = inputs

  const updatedFields: Partial<UserType> = {}

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

// if (profilePic) {
//   const uploadResponse = await cloudinary.uploader.upload(profilePic)
//   updatedFields.profilePic = uploadResponse.secure_url
// }
