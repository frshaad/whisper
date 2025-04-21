import { connect } from 'mongoose'

import { env } from '@/lib/env'
import { User } from '@/models/user.model'

export async function connectDB() {
  try {
    if (env.NODE_ENV === 'production') {
      await User.syncIndexes()
    } else {
      await User.ensureIndexes()
    }
    const { connection } = await connect(env.DB_URI)
    console.log(`🔗 MongoDB Connected: ${connection.host}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`⛓️‍💥 MongoDB Connection Error: ${error.message}`)
    }
    console.error(`⛓️‍💥 MongoDB Connection Error: ${error}`)
  }
}
