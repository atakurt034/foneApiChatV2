import React from 'react'
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import PersonIcon from '@material-ui/icons/Person'
import MessageIcon from '@material-ui/icons/Message'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useSelector } from 'react-redux'

import { useStyles, StyledMenu, StyledMenuItem } from './style'

export const UserMenu = ({ user, history }) => {
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [active, setActive] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setActive(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setActive(false)
  }

  const messageHandler = () => {
    history.push(`/user/${user.id}`)
  }

  return (
    <div>
      <Button
        aria-controls='customized-menu'
        aria-haspopup='true'
        color='primary'
        onClick={(e) => handleClick(e, user.id)}
        variant='text'
        className={active ? classes.active : classes.inactive}
      >
        {user.name}
      </Button>

      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Info' />
        </StyledMenuItem>
        <StyledMenuItem onClick={messageHandler}>
          <ListItemIcon>
            <MessageIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Message' />
        </StyledMenuItem>
        {userInfo && userInfo.isAdmin && (
          <StyledMenuItem>
            <ListItemIcon>
              <HighlightOffIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Kick' />
          </StyledMenuItem>
        )}
      </StyledMenu>
    </div>
  )
}
