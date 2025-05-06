import type { Types } from 'mongoose'

import cloudinary from '@/lib/cloudinary'
import { AppError } from '@/lib/errors'
import { escapeRegex } from '@/lib/helpers'
import type { MinimalUser } from '@/lib/types'
import type {
  SearchQueryParams,
  UpdateUserInfoObj,
} from '@/lib/zod-schemas/user.zod'
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

export async function deleteAccountService(userId: Types.ObjectId) {
  await User.findByIdAndDelete(userId)
}

// =====================
// ===== Contacts ======
// =====================

export async function getAllContactsService(userId: Types.ObjectId) {
  const user = await User.findById(userId)
    .populate<{
      contacts: MinimalUser[]
    }>('contacts', 'username fullname profilePic _id')
    .select('contacts blockedUsers')

  if (!user) {
    throw new AppError(404, 'Access denied. User not found.')
  }

  const blockedIds = new Set(user.blockedUsers.map(String))
  const contacts = user.contacts.filter(
    (contact) => !blockedIds.has(contact.id.toString()),
  )

  return contacts
}

export async function addContactService(
  userId: Types.ObjectId,
  contactId: Types.ObjectId,
) {
  const user = await User.findById(userId).select('contacts')

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
  const user = await User.findById(userId).select('contacts')

  if (!user) {
    throw new AppError(401, 'Access denied. User not found.')
  }

  const initialLength = user.contacts.length
  user.contacts = user.contacts.filter((id) => !id.equals(contactId))

  if (user.contacts.length === initialLength) {
    throw new AppError(400, 'User is not in your contacts')
  }

  await user.save()
}

// ==========================
// ===== Blocked Users ======
// ==========================
export async function getBlockedUsersService(userId: Types.ObjectId) {
  const user = await User.findById(userId)
    .populate('blockedUsers', 'username fullname profilePic _id')
    .select('blockedUsers')

  if (!user) {
    throw new AppError(404, 'Access denied. User not found.')
  }

  return user.blockedUsers
}

export async function blockUserService(
  userId: Types.ObjectId,
  blockId: Types.ObjectId,
) {
  const user = await User.findById(userId).select('blockedUsers')

  if (!user) {
    throw new AppError(401, 'Access denied. User not found.')
  }

  const isAlreadyBlocked = user.blockedUsers.some((id) => id.equals(blockId))

  if (isAlreadyBlocked) {
    throw new AppError(400, 'You already blocked the user.')
  }

  user.blockedUsers.push(blockId)
  await user.save()
}

export async function unblockUserService(
  userId: Types.ObjectId,
  blockId: Types.ObjectId,
) {
  const user = await User.findById(userId).select('blockedUsers')

  if (!user) {
    throw new AppError(401, 'Access denied. User not found.')
  }

  const newBlocked = user.blockedUsers.filter((id) => !id.equals(blockId))

  if (newBlocked.length === user.blockedUsers.length) {
    throw new AppError(400, 'User is not in your block')
  }

  user.blockedUsers = newBlocked
  await user.save()
}

// ========================
// ===== Search User ======
// ========================
export async function searchQueryService({ limit, q }: SearchQueryParams) {
  const safeRegex = new RegExp('^' + escapeRegex(q), 'i') // prefix match only

  return await User.find({
    $or: [
      { username: { $regex: safeRegex } },
      { fullname: { $regex: safeRegex } },
    ],
  })
    .select('username fullname profilePic')
    .limit(limit)
}
