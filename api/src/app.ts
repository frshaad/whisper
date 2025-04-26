import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'

import authRouter from '@/routes/auth.route'
import chatRouter from '@/routes/chat.route'
import messageRouter from '@/routes/message.route'
import userRouter from '@/routes/user.route'

const app = express()

app.use(express.json()) // To parse req.body
app.use(express.urlencoded({ extended: true })) // To parse form data(urlencoded)
app.use(cookieParser())
app.use(helmet())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/messages', messageRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/chat', chatRouter)

export default app
