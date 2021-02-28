import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import ChatIcon from '@material-ui/icons/Chat'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'
import axios from 'axios'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const MyRooms = ({ socket }) => {
  const dispatch = useDispatch()

  const count = 1

  const { userInfo } = useSelector((state) => state.userLogin)
  const { messages, loading, error } = useSelector((state) => state.privateMsg)

  React.useEffect(() => {
    if (messages) {
    }
  }, [messages])

  React.useEffect(() => {
    if (socket) {
      socket.on('privateOutput', () => {
        dispatch(UA.getPrivateMsgs())
        const getmessage = async () => {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
          const { data } = await axios.get(
            '/api/chatrooms/private/message',
            config
          )
          console.log(data, userInfo._id)
        }
        getmessage()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  React.useEffect(() => {
    dispatch(UA.getPrivateMsgs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <IconButton
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        width: 20,
      }}
      size='small'
      color={count ? 'inherit' : 'default'}
      aria-label='cart'
    >
      <StyledBadge badgeContent={count} color='error'>
        <ChatIcon />
      </StyledBadge>
    </IconButton>
  )
}
