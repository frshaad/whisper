import type { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import { sanitizeUser } from '@/lib/utils'
import type { UpdateUserInfoObj } from '@/lib/zod-schemas/user.zod'
import { User, type UserDoc } from '@/models/user.model'

export async function updateUserInfoService(
  inputs: UpdateUserInfoObj,
  userId: Types.ObjectId,
) {
  const updatedFields: Partial<UserDoc> = {}

  if (inputs.fullname) {
    updatedFields.fullname = inputs.fullname
  }

  if (inputs.bio) {
    updatedFields.bio = inputs.bio
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

export async function updateProfilePicService(
  profilePic: string,
  user: UserDoc,
) {
  if (user.profilePicPublicId) {
    await cloudinary.uploader.destroy(user.profilePicPublicId)
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    profilePic,
    {
      folder: 'users',
      transformation: [
        { width: 300, height: 300, crop: 'limit' },
        { quality: 'auto' },
      ],
    },
  )

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        profilePic: secure_url,
        profilePicPublicId: public_id,
      },
    },
    { new: true },
  )

  if (!updatedUser) {
    throw new AppError(404, 'User not found')
  }

  return sanitizeUser(updatedUser)
}
