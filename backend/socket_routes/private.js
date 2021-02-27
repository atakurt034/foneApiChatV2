export const privateJoin = (User, Message, socket, io) => async ({
  chatroomId,
}) => {
  const user = await User.findOne({ _id: socket.userId })

  let user_messages
  if (chatroomId) {
    user_messages = await Message.updateMany(
      { chatroomId, seenBy: { $ne: user } },
      { $push: { seenBy: user } },
      { new: true }
    )
  }
  socket.join(chatroomId)
  io.to(chatroomId).emit('privateJoin', {
    name: user.name,
  })
}

export const privateLeave = (User, io, socket) => async ({ chatroomId }) => {
  const user = await User.findOne({ _id: socket.userId })

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
  if (message.trim().length > 0) {
    const id = socket.userId
    const user = await User.findById(id)
    let private_room

    if (chatroomId) {
      private_room = await PrivateRoom.findById(chatroomId)
    }
    const newMessage = await Message.create({
      message,
      user,
      chatroomId,
      seenBy: user,
    })

    io.to(chatroomId).emit('privateOutput', {
      message,
      name,
      image,
      chatroomId,
      id: socket.userId,
    })
    await private_room.messages.push(newMessage)
    await private_room.save()
  }
}
