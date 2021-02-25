import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

import { createServer } from 'http'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import { user, chatroom } from './routes/index.js'
import morgan from 'morgan'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// routes
app.use('/api/users', user)
app.use('/api/chatrooms', chatroom)

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

// error handlers
app.use(errorHandler)
app.use(notFound)

export const server = createServer(app).listen(
  process.env.PORT,
  console.log(`connected on port ${process.env.PORT}`)
)
