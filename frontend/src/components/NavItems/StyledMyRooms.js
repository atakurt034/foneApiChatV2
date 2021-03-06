import React from 'react'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import ChatIcon from '@material-ui/icons/Chat'

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 3,
    top: 1,
    padding: '0 1px',
  },
}))(Badge)

export const MyRooms = ({ counter }) => {
  const count = counter

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
