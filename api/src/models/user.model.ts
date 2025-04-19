import { type InferSchemaType, model, Schema, Types } from 'mongoose'

const userSchema = new Schema(
  {
    email: { type: String, trim: true, required: true, unique: true },
    fullname: { type: String, trim: true, required: true },
    password: { type: String, required: true, minLength: 8 },
    profilePic: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
)

const User = model('User', userSchema)

type UserType = InferSchemaType<typeof userSchema>
type UserTypeWithId = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId
}

export { User, type UserType, type UserTypeWithId }
