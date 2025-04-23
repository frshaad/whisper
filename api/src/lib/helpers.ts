import { Schema, type Types } from 'mongoose'

// create mongoose array schema
export function createUniqueArrayField(ref: string) {
  return {
    type: [Schema.Types.ObjectId],
    ref,
    default: [],
    validate: {
      validator(ids: Types.ObjectId[]) {
        return ids.length === new Set(ids.map((id) => id.toString())).size
      },
      message: `Duplicate ${ref.toLowerCase()} are not allowed`,
    },
  }
}
