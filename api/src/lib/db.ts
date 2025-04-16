import mongoose from 'mongoose'

import { env } from '@/lib/env'

export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(env.DB_URI)
    console.log(`🔗 MongoDB Connected: ${connection.host}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`⛓️‍💥 MongoDB Connection Error: ${error.message}`)
    }
    console.error(`⛓️‍💥 MongoDB Connection Error: ${error}`)
  }
}
