import { type InferSchemaType, model, Schema, Types } from 'mongoose'

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true },
)

const Message = model('Message', messageSchema)
type MessageType = InferSchemaType<typeof messageSchema> & {
  _id: Types.ObjectId
}

export { Message, type MessageType }
