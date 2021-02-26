export const privateJoin = (User, PrivateRoom, users, socket, io) => async ({
  chatroomId,
}) => {
  const user = await User.findOne({ _id: socket.userId })
  const chatroom = await PrivateRoom.findById(chatroomId)

  users[socket.userId] = { ...user._doc, chatroomId }

  socket.join(chatroomId)

  io.to(chatroomId).emit('privateJoin', {
    name: user.name,
    users,
  })
  await chatroom.save()
}

export const privateLeave = (User, users, io, socket) => async ({
  chatroomId,
}) => {
  const user = await User.findOne({ _id: socket.userId })

  delete users[socket.userId]

  io.to(chatroomId).emit('privateLeave', {
    name: user.name,
    users,
  })
  socket.leave(chatroomId)
}

export const privateInput = (User, PrivateRoom, Message, io, socket) => async ({
  message,
  name,
  image,
  chatroomId,
}) => {
  if (message.trim().length > 0) {
    const id = socket.userId
    const user = await User.findById(id)
    const chatroom = await PrivateRoom.findById(chatroomId)
    const newMessage = await Message.create({
      message,
      user,
      chatroomId,
    })

    chatroom.messages.push(newMessage)

    io.to(chatroomId).emit('privateOutput', {
      message,
      name,
      image,
      chatroomId,
      id: socket.userId,
    })
    await chatroom.save()
  }
}
