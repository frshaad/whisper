import app from '@/app'
import { connectDB } from '@/lib/db'
import { env } from '@/lib/env'

const { PORT } = env

app.listen(PORT, () => {
  console.log(`👂 Server is listening on port ${PORT}`)
  connectDB()
})
