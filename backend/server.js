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

import { PR, Private } from './socket_routes/index_socket.js'
import Message from './models/messages.js'
import User from './models/user.js'
import mongoose from 'mongoose'
import PrivateRoom from './models/privaterooms.js'

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

// returns the union of two arrays where duplicate objects with the same 'prop' are removed

io.on('connect', (socket) => {
  socket.on('joinRoom', PR.joinRoom(io, socket))
  socket.on('leaveRoom', PR.leaveRoom(io, socket))
  socket.on('input', PR.input(io, socket))
  socket.on('kick', ({ user, chatroomId }) => {
    io.to(chatroomId).emit('kicked', { user, chatroomId })
  })
  socket.on('privateJoin', Private.privateJoin(io, socket))
  socket.on('privateLeave', Private.privateLeave(io, socket))
  socket.on('privateInput', Private.privateInput(io, socket))
  socket.on('online', Private.online(io, socket))
  socket.on('offline', Private.offline(io, socket))
  socket.onAny(Private.listener(io, socket))
})
