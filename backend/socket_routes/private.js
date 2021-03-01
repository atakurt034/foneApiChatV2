// private users
const users = {}

export const privateJoin = (User, Message, socket, io) => async ({
  chatroomId,
}) => {
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
  io.emit('refreshCount')
  io.to(chatroomId).emit('privateJoin', {
    name: user.name,
  })
}

export const privateLeave = (User, io, socket) => async ({ chatroomId }) => {
  const user = await User.findOne({ _id: socket.userId })

  delete users[socket.userId]

  io.to(chatroomId).emit('privateLeave', {
    name: user.name,
  })
  socket.leave(chatroomId)
}

export const privateInput = (User, PrivateRoom, Message, io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
}) => {
  io.emit('refreshCount')
  if (message.trim().length > 0) {
    const id = socket.userId
    const user = await User.findById(id)
    let private_room
    let userList = Object.values(users)

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
