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

// to avoid malicious regex injection
export function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex control chars
}
