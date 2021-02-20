import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStyles, StyledBadge, StyledMenu, StyledMenuItem } from './acStyle'
import {
  Button,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography,
  Avatar,
} from '@material-ui/core'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PersonIcon from '@material-ui/icons/Person'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import HomeIcon from '@material-ui/icons/Home'
import ContactsIcon from '@material-ui/icons/Contacts'

import { Admin } from './Admin'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { UA } from '../../../actions/index'
import { MyRooms } from '../StyledMyRooms'
import { ModalLoader } from '../../ModalLoader'

const Account = ({ history }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles()

  const { userInfo, loading, logout } = useSelector((state) => state.userLogin)

  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logoutHandler = () => {
    dispatch(UA.logout())
    handleClose()
  }
  let size = 'small'
  if (sm) {
    size = 'large'
  }
  const avatarIcon = (
    <StyledBadge
      overlap='circle'
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant='dot'
    >
      <Avatar
        alt={userInfo ? userInfo.name.split(' ')[0] : ''}
        className={classes.avatar}
      />
    </StyledBadge>
  )

  React.useEffect(() => {
    if (logout) {
      history.push('/login')
    }
  }, [history, logout])

  const logged = (
    <>
      <Link className={classes.link} to='/login'>
        <Button
          variant='contained'
          disableElevation
          color='primary'
          onClick={userInfo && handleClick}
          size='small'
          startIcon={userInfo ? avatarIcon : <PersonIcon fontSize={size} />}
          endIcon={userInfo && <ArrowDropDownIcon />}
        >
          <Typography variant='caption'>
            {userInfo ? (
              userInfo.name.split(' ')[0]
            ) : (
              <Typography style={{ fontWeight: 600 }} variant='caption'>
                LOGIN
              </Typography>
            )}
          </Typography>
        </Button>
      </Link>

      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/'>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/profile'>
            <ListItemIcon>
              <PersonIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Profile' />
          </Link>
        </StyledMenuItem>

        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/rooms/id'>
            <ListItemIcon>
              <MyRooms />
            </ListItemIcon>
            <ListItemText primary='My Rooms' />
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/rooms/id'>
            <ListItemIcon>
              <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary='Contacts' />
          </Link>
        </StyledMenuItem>
        {userInfo && userInfo.isAdmin && <Admin />}
        <StyledMenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <ExitToAppIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </StyledMenuItem>
      </StyledMenu>
    </>
  )

  return loading || typeof window === 'undefined' ? <ModalLoader /> : logged
}

export default withRouter(Account)
