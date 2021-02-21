import React from 'react'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import PersonIcon from '@material-ui/icons/Person'
import MessageIcon from '@material-ui/icons/Message'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useSelector } from 'react-redux'

import { StyledMenu, StyledMenuItem } from './style'
import { Avatar, Chip } from '@material-ui/core'

export const ChipUser = ({ text, history }) => {
  const { userInfo } = useSelector((state) => state.userLogin)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const messageHandler = () => {
    history.push(`/user/${text.id}`)
  }

  return (
    <div>
      <Chip
        clickable
        disableRipple
        onClick={(e) => handleClick(e, text.id)}
        variant='outlined'
        label={text.name && text.name.split(' ')[0]}
        size='small'
        avatar={<Avatar src={text.image && text.image} alt={text.name} />}
        style={{ border: 'none', margin: 0, padding: 0 }}
      />

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

export const ChipUserOld = ({ text, history }) => {
  const { userInfo } = useSelector((state) => state.userLogin)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const messageHandler = () => {
    history.push(`/user/${text.id}`)
  }

  return (
    <div>
      <Chip
        clickable
        disableRipple
        onClick={(e) => handleClick(e, text.id)}
        variant='outlined'
        label={text.user.name && text.user.name.split(' ')[0]}
        size='small'
        avatar={<Avatar src={text.user.image} alt={text.user.name} />}
        style={{ border: 'none', margin: 0, padding: 0 }}
      />

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
