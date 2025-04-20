import { type InferSchemaType, model, Schema, Types } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, trim: true, required: true, unique: true },
    fullname: { type: String, trim: true, required: true },
    password: { type: String, required: true, minlength: 8 },
    profilePic: { type: String, default: '' },
  },
  { timestamps: true },
)

const User = model('User', userSchema)
type UserType = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId
}

export { User, type UserType }
