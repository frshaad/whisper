import {
  type HydratedDocument,
  type InferSchemaType,
  model,
  Schema,
} from 'mongoose'

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: { type: String, trim: true, maxlength: 2000 },
    image: { type: String },
    readStatus: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })

export const Message = model('Message', messageSchema)
export type MessageDoc = HydratedDocument<InferSchemaType<typeof messageSchema>>
