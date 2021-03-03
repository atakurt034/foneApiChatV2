export const getUserInfo = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState()
  return userInfo
}

export const getConfig = (token) => {
  let config

  if (token) {
    config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  } else {
    config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  return config
}

export const handleErros = (error) => {
  if (error.response && error.response.data.message) {
    return error.response.data.message
  } else {
    return error.message
  }
}

export const getCount = (data) => {
  const counter = []
  if (data) {
    data.map((data) =>
      data.privateRooms.map((privateRooms, index1) =>
        privateRooms.messages.map((messages, index2) =>
          messages.seenBy.map((seenBy, index3) => counter.push(seenBy))
        )
      )
    )
  }
  return counter.length
}
