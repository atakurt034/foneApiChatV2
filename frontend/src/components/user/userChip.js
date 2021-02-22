import React from 'react'
import {
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Modal,
  Card,
  CardHeader,
  Grid,
  Divider,
  CardActionArea,
  Button,
  CardActions,
} from '@material-ui/core'

import PersonIcon from '@material-ui/icons/Person'
import MessageIcon from '@material-ui/icons/Message'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useSelector } from 'react-redux'

import { StyledMenu, StyledMenuItem } from './style'

export const ChipUser = ({ text, history }) => {
  const { userInfo } = useSelector((state) => state.userLogin)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuHandler = (type) => {
    switch (type) {
      case 'message':
        history.push(`/user/${text.id}`)
        handleClose()
        break
      case 'info':
        setOpen(true)
        handleClose()
        break
      default:
        return type
    }
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

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={3} style={{ height: '20vh' }}>
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
              src={text.image}
              alt={text.name}
            />
            <CardHeader style={{ textAlign: 'center' }} title={text.name} />
            <Divider />
            <CardActions
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: 10,
              }}
            >
              <Button color='primary' variant='contained'>
                Add to friends
              </Button>
              <Button color='secondary' variant='contained'>
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
