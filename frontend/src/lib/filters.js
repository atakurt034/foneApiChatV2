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

export const last_sent = (DataArray, type) => {
  let array = []
  let result = DataArray.map(({ isMine }) => (isMine ? true : false))

  if (type === 'yours') {
    result = DataArray.map(({ isMine }) => (!isMine ? true : false))
  }

  result.map((rs, index) =>
    index === 0
      ? array.push({ index: index, prev: false })
      : rs &&
        array.push({
          index,
          prev: array.some((x) => x.index === index - 1),
        })
  )
  array.map(
    (x, i) => (x['next'] = result.some((xs, i) => xs && i === x.index + 1))
  )
  return array
}
