import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { useStyles, StyledBadge } from './acStyle'
import {
  Button,
  Menu,
  MenuItem,
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

import { Admin } from './Admin'
import { useSelector, useDispatch } from 'react-redux'

import { UA } from '../../../actions/index'
import { MyRooms } from '../StyledMyRooms'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)

export const Account = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

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
        {userInfo && userInfo.isAdmin && <Admin />}
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/rooms/id'>
            <ListItemIcon>
              <MyRooms />
            </ListItemIcon>
            <ListItemText primary='My Rooms' />
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <ExitToAppIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </StyledMenuItem>
      </StyledMenu>
    </>
  )

  return logged
}
