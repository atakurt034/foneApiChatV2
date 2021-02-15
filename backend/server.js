import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'

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
app.get('/', (req, res) => {
  res.send('hello')
})
app.use('/api/users', user)
app.use('/api/chatrooms', chatroom)

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
const rooms = {}

// returns the union of two arrays where duplicate objects with the same 'prop' are removed
const removeDuplicatesWith = (a, b, prop) => {
  a.filter((x) => !b.find((y) => x[prop] === y[prop]))
}

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
    users[socket.userId] = user.name
    rooms[chatroomId + ',' + user._id] = user._id
    socket.join(chatroomId)

    io.to(chatroomId).emit('joinRoom', { name: user.name, users })
    io.emit('publicJoin', rooms)
    await chatroom.save()
  })

  socket.on('leaveRoom', async ({ chatroomId }) => {
    const user = await User.findOne({ _id: socket.userId })

    delete users[socket.userId]
    delete rooms[chatroomId + ',' + user._id]

    io.to(chatroomId).emit('leaveRoom', { name: user.name, users })
    io.emit('publicLeave', rooms)
    socket.leave(chatroomId)
  })

  socket.on('input', async ({ message, chatroomId, id }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId })
      const chatroom = await Chatroom.findById(chatroomId)
      const newMessage = await Message.create({
        message,
        user,
        chatroom: chatroomId,
      })

      chatroom.messages.push(newMessage)

      io.to(chatroomId).emit('output', {
        message,
        name: user.name,
        id,
      })
      await chatroom.save()
    }
  })
})
