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

const Account = ({ history, counter }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles()

  const { userInfo, loading, logout } = useSelector((state) => state.userLogin)
  const { details, loading: loadingDetails } = useSelector(
    (state) => state.userDetails
  )
  const { status } = useSelector((state) => state.userUpdate)

  const [{ name, image }, setUser] = React.useState({})
  const count = counter

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
      variant={count > 0 ? 'dot' : 'standard'}
    >
      <Avatar
        src={userInfo ? image : ''}
        alt={userInfo ? name : ''}
        className={classes.avatar}
      />
    </StyledBadge>
  )

  React.useEffect(() => {
    if (userInfo) {
      dispatch(UA.getUserDetails())
    }
  }, [userInfo, dispatch])

  React.useEffect(() => {
    if (logout) {
      history.push('/login')
    }

    if (details || status === 200) {
      setUser({ name: details.name.split(' ')[0], image: details.image })
    }
  }, [history, logout, status, details])

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
              name
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
          <Link
            className={classes.link}
            to={`/private/${userInfo && userInfo._id}`}
          >
            <ListItemIcon>
              <MyRooms counter={counter} />
            </ListItemIcon>
            <ListItemText primary='Private Rooms' />
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

  return loading || loadingDetails || typeof window === 'undefined' ? (
    <ModalLoader />
  ) : (
    logged
  )
}

export default withRouter(Account)
