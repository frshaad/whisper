import type { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import type { UpdateUserInfoObj } from '@/lib/zod-schemas/user.zod'
import { User, type UserDoc } from '@/models/user.model'

export async function updateUserInfoService(
  inputs: UpdateUserInfoObj,
  userId: Types.ObjectId,
) {
  const updatedFields: Partial<Pick<UserDoc, 'fullname' | 'bio'>> = {}

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

  return updatedUser
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

  return updatedUser
}

export async function getAllContactsService(userId: Types.ObjectId) {
  const user = await User.findById(userId).populate(
    'contacts',
    'username fullname profilePic id',
  )
  if (!user) {
    throw new AppError(404, 'Access denied. User not found.')
  }

  return user.contacts
}

export async function addContactService(
  userId: Types.ObjectId,
  contactId: Types.ObjectId,
) {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(401, 'Access denied. User not found.')
  }

  const isAlreadyContact = user.contacts.some((id) => id.equals(contactId))

  if (isAlreadyContact) {
    throw new AppError(400, 'User is already in your contacts')
  }

  user.contacts.push(contactId)
  await user.save()
}

export async function removeContactService(
  userId: Types.ObjectId,
  contactId: Types.ObjectId,
) {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(401, 'Access denied. User not found.')
  }

  const wasInContacts = user.contacts.some((id) => id.equals(contactId))

  if (!wasInContacts) {
    throw new AppError(400, 'User is not in your contacts')
  }

  user.contacts = user.contacts.filter((id) => !id.equals(contactId))
  await user.save()
}
