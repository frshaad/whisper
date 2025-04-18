import express from 'express'
import helmet from 'helmet'

import authRouter from '@/routes/auth.route'

const app = express()

app.use(express.json()) // To parse req.body
app.use(express.urlencoded({ extended: true })) // To parse form data(urlencoded)
app.use(helmet())

app.use('/api/v1/auth', authRouter)

export default app
