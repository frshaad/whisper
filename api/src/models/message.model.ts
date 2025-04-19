import { type InferSchemaType, model, Schema, Types } from 'mongoose'

const messageSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    text: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  },
)

const Message = model('Message', messageSchema)

type MessageType = InferSchemaType<typeof messageSchema>
type MessageTypeWithId = InferSchemaType<typeof messageSchema> & {
  _id: Types.ObjectId
}

export { Message, type MessageType, type MessageTypeWithId }
