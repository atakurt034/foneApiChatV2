export const filter_room = (users, chatroomId) => {
  const room = Object.values(users).filter(
    (user) => user.chatroomId === chatroomId
  )
  if (room) {
    return room.map((user) => ({
      name: user.name,
      id: user._id,
      image: user.image,
    }))
  }
}
