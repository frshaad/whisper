import { type InferSchemaType, model, Schema, Types } from 'mongoose'

import { PROFILE_PICTURE_REGEX_PATTERN } from '@/lib/constants'

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      lowercase: true,
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
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
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    isOnline: {
      type: Boolean,
      default: false,
    },
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
  { timestamps: true },
)

userSchema.index({ username: 1 })

export type UserType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId
}
export const User = model('User', userSchema)
