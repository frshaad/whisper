import { type InferSchemaType, model, Schema } from 'mongoose'

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
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
  _id: Schema.Types.ObjectId
}

export { Message, type MessageType, type MessageTypeWithId }
