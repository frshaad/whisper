import bcrypt from 'bcryptjs'
import { HydratedDocument, type InferSchemaType, model, Schema } from 'mongoose'

import {
  MAX_FULLNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_FULLNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PROFILE_PICTURE_REGEX_PATTERN,
} from '@/lib/constants'
import { createUniqueArrayField } from '@/lib/helpers'
import { hashPassword } from '@/lib/utils'

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: MIN_USERNAME_LENGTH,
      maxlength: MAX_USERNAME_LENGTH,
      lowercase: true,
      immutable: true,
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      minlength: MIN_FULLNAME_LENGTH,
      maxlength: MAX_FULLNAME_LENGTH,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      ],
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    profilePic: {
      type: String,
      default: '',
      validate: {
        validator: (v: string) =>
          v === '' || PROFILE_PICTURE_REGEX_PATTERN.test(v),
        message: 'Invalid profile picture URL',
      },
    },
    profilePicPublicId: {
      type: String,
      default: '',
      validate: {
        validator: (v: string) => typeof v === 'string' && !v.includes('..'),
        message: 'Invalid public ID',
      },
    },
    contacts: createUniqueArrayField('User'),
    blockedUsers: createUniqueArrayField('User'),
    lastSeen: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
      maxlength: 160,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for search, sort, and online user tracking optimizations
userSchema.index({ createdAt: -1 })
userSchema.index({ lastSeen: -1 })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await hashPassword(this.password)
  this.passwordChangedAt = new Date()

  next()
})

userSchema.methods.comparePassword = async function (
  this: UserDoc,
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.virtual('contactDetails', {
  ref: 'User',
  localField: 'contacts',
  foreignField: '_id',
})

userSchema.virtual('blockedUserDetails', {
  ref: 'User',
  localField: 'blockedUsers',
  foreignField: '_id',
})

export type UserDoc = HydratedDocument<
  InferSchemaType<typeof userSchema>,
  {
    comparePassword(candidatePassword: string): Promise<boolean>
  }
>

export const User = model<UserDoc>('User', userSchema)
