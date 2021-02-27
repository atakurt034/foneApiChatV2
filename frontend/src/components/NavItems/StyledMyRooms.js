import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import ChatIcon from '@material-ui/icons/Chat'

import { useDispatch, useSelector } from 'react-redux'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const MyRooms = () => {
  const dispatch = useDispatch()
  const orderCount = [1]

  const count = orderCount.length

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
