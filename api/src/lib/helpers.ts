import { Schema, type Types } from 'mongoose'

// export function excludeFields<T extends object, K extends keyof T>(
//   obj: T,
//   keys: K[],
// ): Omit<T, K> {
//   const clone = { ...obj }
//   for (const key of keys) {
//     delete clone[key]
//   }
//   return clone
// }

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
