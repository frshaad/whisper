import 'dotenv/config'

import express from 'express'

import authRouter from '@/routes/auth.route'

const app = express()

app.use('/api/auth', authRouter)

export default app
