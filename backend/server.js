import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Chat from './models/chat.js'
import user from './routes/user.js'

import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.Server(app)
const client = new Server(server)

dotenv.config()
client.use(user)
client.listen(process.env.PORT)

// Connect to mongo
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.log(`mongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
connectDB()

client.on('connection', function (socket) {
  sendStatus = function (s) {
    socket.emit('status', s)
  }

  Chat.find()
    .limit(100)
    .sort({ _id: 1 })
    .toArray(function (err, res) {
      if (err) {
        throw err
      }

      socket.emit('output', res)
    })

  socket.on('input', function (data) {
    let name = data.name
    let message = data.message

    if (name == '' || message == '') {
      sendStatus('Please enter a name and message')
    } else {
      chat.insert({ name: name, message: message }, function () {
        client.emit('output', [data])

        sendStatus({
          message: 'Message sent',
          clear: true,
        })
      })
    }
  })

  socket.on('clear', function (data) {
    Chat.remove({}, function () {
      socket.emit('cleared')
    })
  })
})
