import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import ChatIcon from '@material-ui/icons/Chat'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const MyRooms = ({ socket }) => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { counter } = useSelector((state) => state.privateCount)

  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (socket && userInfo) {
      socket.on('privateOutput', () => {
        dispatch(UA.getPrvtMsgCount())
      })
    }
    if (counter) {
      setCount(counter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, counter])

  React.useEffect(() => {
    dispatch(UA.getPrvtMsgCount())
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
