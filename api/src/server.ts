import app from '@/app'
import { env } from '@/lib/env'

const { PORT } = env

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
