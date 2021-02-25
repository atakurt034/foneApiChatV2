import React from 'react'
import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import PersonIcon from '@material-ui/icons/Person'
import MessageIcon from '@material-ui/icons/Message'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useSelector } from 'react-redux'

import { useStyles, StyledMenu, StyledMenuItem } from './style'
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Grid,
  Modal,
} from '@material-ui/core'

export const UserMenu = ({ user, history, socket, chatroomId, closed }) => {
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [active, setActive] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setActive(true)
  }

  const handleClose = (e) => {
    setAnchorEl(null)
    setActive(false)
  }

  const handleKick = () => {
    if (socket) {
      socket.emit('kick', { user: user.id, chatroomId })
    }
  }
  React.useEffect(() => {
    if (socket) {
      socket.on('kicked', (data) => {
        if (data.user === userInfo._id && data.chatroomId === chatroomId) {
          history.push('/')
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const menuHandler = (type) => {
    switch (type) {
      case 'message':
        history.push(`/user/${user.id}`)
        handleClose()
        break
      case 'info':
        setOpen(true)
        handleClose()
        break

      case 'kick':
        handleKick()
        handleClose()
        break
      default:
        return type
    }
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
        <Avatar
          src={user.image}
          alt={user.name}
          style={{ margin: '5px 5px 5px 0' }}
        />{' '}
        {user.name}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={8} sm={3} style={{ height: '20vh' }}>
          <Card elevation={12}>
            <Avatar
              style={{
                width: '5vw',
                height: '5vw',
                padding: 3,
                borderRadius: '50%',
                border: '2px solid #ccc',
                margin: '10px auto 0',
              }}
              src={user.image}
              alt={user.name}
            />
            <CardHeader style={{ textAlign: 'center' }} title={user.name} />
            <Divider />
            <CardActions
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: 10,
              }}
            >
              <Button color='primary' size='small' variant='contained'>
                Add to friends
              </Button>
              <Button color='secondary' size='small' variant='contained'>
                Block
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Modal>

      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={() => menuHandler('info')}>
          <ListItemIcon>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Info' />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => menuHandler('message')}>
          <ListItemIcon>
            <MessageIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Message' />
        </StyledMenuItem>
        {userInfo && userInfo.isAdmin && (
          <StyledMenuItem onClick={() => menuHandler('kick')}>
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
