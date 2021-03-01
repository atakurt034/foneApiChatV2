const users = {}
import User from '../models/user.js'
import Message from '../models/messages.js'
import Chatroom from '../models/chatrooms.js'

export const joinRoom = (io, socket) => async ({ chatroomId }) => {
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
}

export const leaveRoom = (io, socket) => async ({ chatroomId }) => {
  const user = await User.findOne({ _id: socket.userId })

  delete users[socket.userId]

  io.to(chatroomId).emit('leaveRoom', {
    name: user.name,
    users,
  })
  io.emit('publicLeave', users)
  socket.leave(chatroomId)
}

export const input = (io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
}) => {
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
      image,
      chatroomId,
      id: socket.userId,
    })
    await chatroom.save()
  }
}
