// private users
const users = {}
import User from '../models/user.js'
import Message from '../models/messages.js'
import PrivateRoom from '../models/privaterooms.js'

export const listener = (io, socket) => async (eventNames, args) => {
  if (eventNames === 'privateInput') {
    const id = args.chatroomId
    const room = await PrivateRoom.findById(id)
      .select('users -_id')
      .populate({
        path: 'users',
        model: 'User',
        select: '_id',
        match: { _id: { $ne: socket.userId } },
      })
    const roomId = room.users[0]._id.toString()
    io.to(roomId).emit('refreshCount')
  }
}

export const online = (io, socket) => async () => {
  const chatroomId = socket.userId

  socket.join(chatroomId)
}

export const offline = (io, socket) => async () => {
  const chatroomId = socket.userId
  socket.leave(chatroomId)
  io.to(chatroomId).emit('userOffline')
}

export const privateJoin = (io, socket) => async ({ chatroomId }) => {
  const user = await User.findOne({ _id: socket.userId })

  users[socket.userId] = user._id
  const userList = Object.values(users)

  if (chatroomId) {
    await Message.updateMany(
      { chatroomId, seenBy: { $ne: user } },
      { $push: { seenBy: userList } },
      { new: true }
    )
  }
  socket.join(chatroomId)
  io.to(chatroomId).emit('privateJoin', {
    name: user.name,
    from: 'server',
  })
}

export const privateLeave = (io, socket) => async ({ chatroomId }) => {
  const user = await User.findOne({ _id: socket.userId })

  delete users[socket.userId]

  io.to(chatroomId).emit('privateLeave', {
    name: user.name,
  })
  socket.leave(chatroomId)
}

export const privateInput = (io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
}) => {
  if (message.trim().length > 0) {
    const id = socket.userId
    const user = await User.findById(id)
    let userList = Object.values(users)
    let private_room

    if (chatroomId) {
      private_room = await PrivateRoom.findById(chatroomId)
    }
    if (userList.length <= 0) {
      userList = user
    }
    const newMessage = new Message({
      message,
      user,
      chatroomId,
      seenBy: userList,
    })
    const message_created = await newMessage.save()
    io.to(chatroomId).emit('privateOutput', {
      message,
      name,
      image,
      chatroomId,
      id: socket.userId,
    })

    await private_room.messages.push(message_created)
    await private_room.save()
  }
}
