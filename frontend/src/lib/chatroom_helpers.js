import axios from 'axios'

export const scrollToBottom = (myRef) => {
  if (myRef.current) {
    myRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  } else {
    return
  }
}

export const loadOldHandler = (
  setIsLoading,
  setLimit,
  limit,
  userInfo,
  chatroomId,
  oldMsg,
  setOldMsg,
  setShowOld
) => async () => {
  setIsLoading(true)
  let skip = 11
  setLimit(limit + 10)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  const { data } = await axios.get(
    `/api/chatrooms/messages/${chatroomId}?skip=${skip}&limit=${limit}`,
    config
  )

  const newArray = await data.filter((msg) =>
    oldMsg.map((old) => old._id !== msg._id)
  )
  newArray.map(
    (item, index) => (newArray[index].isSender = item.user._id === userInfo._id)
  )
  setOldMsg([...newArray.reverse()])
  setIsLoading(false)
  if (data.length === oldMsg.length) {
    setShowOld(false)
  }
}
