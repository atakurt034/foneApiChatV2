export const room = (users, chatroomId) => {
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

export const array = (array, type) => {
  let indexes
  const arrIndex = []
  if (type === 'yours') {
    array.map((user, index) => !user.isMine && arrIndex.push(index))
    indexes = arrIndex[arrIndex.length - 1]
  } else {
    array.map((user, index) => user.isMine && arrIndex.push(index))
    indexes = arrIndex[arrIndex.length - 1]
  }

  return indexes
}
