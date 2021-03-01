export const getCount = (user_count) => {
  const result = new Promise((resolve) => {
    const counter = []
    user_count.map((x) =>
      x.privateRooms.map((privateRooms, index1) =>
        privateRooms.messages.map((messages, index2) =>
          messages.seenBy.map((seenBy, index3) => counter.push(seenBy))
        )
      )
    )
    resolve(counter.length)
  })
  return result
}
