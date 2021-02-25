import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import path from 'path'

import { createServer } from 'http'
import { Server } from 'socket.io'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import { user, chatroom } from './routes/index.js'
import jwt from 'jsonwebtoken'

import morgan from 'morgan'
import User from './models/user.js'
import Chatroom from './models/chatrooms.js'
import Message from './models/messages.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Connect to mongo
connectDB()

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

const server = createServer(app).listen(
  process.env.PORT,
  console.log(`connected on port ${process.env.PORT}`)
)
// **************** SOCKET.IO **************** //
const io = new Server(server, { cors: { origin: '*' } })

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (payload) {
      socket.userId = payload.id
    }
    next()
  } catch (err) {}
})

const users = {}

// returns the union of two arrays where duplicate objects with the same 'prop' are removed

io.on('connect', (socket) => {
  socket.on('joinRoom', async ({ chatroomId }) => {
    const user = await User.findOne({ _id: socket.userId })
    const chatroom = await Chatroom.findById(chatroomId)

    const userExist = chatroom.users.find(
      (x) => x.toString() === user._id.toString()
    )

    if (!userExist) {
      chatroom.users.push(user)
    }

    users[socket.userId] = { ...user._doc, chatroomId }

    socket.join(chatroomId)

    io.to(chatroomId).emit('joinRoom', {
      name: user.name,
      users,
    })
    io.emit('publicJoin', users)
    await chatroom.save()
  })

  socket.on('leaveRoom', async ({ chatroomId }) => {
    const user = await User.findOne({ _id: socket.userId })

    delete users[socket.userId]

    io.to(chatroomId).emit('leaveRoom', {
      name: user.name,
      users,
    })
    io.emit('publicLeave', users)
    socket.leave(chatroomId)
  })

  socket.on('input', async ({ message, name, image, chatroomId }) => {
    if (message.trim().length > 0) {
      const id = socket.userId
      const user = await User.findById(id)
      const chatroom = await Chatroom.findById(chatroomId)
      const newMessage = await Message.create({
        message,
        user,
        chatroomId,
      })

      chatroom.messages.push(newMessage)

      io.to(chatroomId).emit('output', {
        message,
        name,
        image: user.image,
        chatroomId,
        id: socket.userId,
      })
      await chatroom.save()
    }
  })
  socket.on('kick', ({ user, chatroomId }) => {
    io.to(chatroomId).emit('kicked', { user, chatroomId })
  })
})
