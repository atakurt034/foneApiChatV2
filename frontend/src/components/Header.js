import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../actions/index'

import { Link } from 'react-router-dom'
import {
  Avatar,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { UserDrawer } from './drawer'
import ListIcon from '@material-ui/icons/List'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const Header = ({ history, socket }) => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const dispatch = useDispatch()
  const classes = useStyles()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading } = userLogin

  const [login, setLogin] = React.useState()
  const [open, setOpen] = React.useState(false)
  const [userList, setUserList] = React.useState([])

  const clickHandler = () => {
    if (login === 'LOGOUT') {
      dispatch(UA.logout())
    } else {
      history.push('/login')
    }
  }

  React.useEffect(() => {
    if (userInfo) {
      setLogin('LOGOUT')
    } else {
      setLogin('LOGIN')
    }
  }, [userInfo])

  React.useEffect(() => {
    if (socket) {
      socket.on('joinRoom', ({ name, users }) => {
        setUserList(Object.values(users))
      })

      socket.on('leaveRoom', ({ name, users }) => {
        setUserList(Object.values(users))
      })
    }
  }, [socket])

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          {sm ? (
            <IconButton onClick={() => setOpen(true)}>
              <ListIcon />
            </IconButton>
          ) : (
            <Avatar />
          )}
          <Typography variant='h6' className={classes.title}>
            {loading ? (
              <Skeleton width={20} variant='text' />
            ) : userInfo ? (
              userInfo.name.split(' ')[0]
            ) : (
              ''
            )}
          </Typography>
          <Link to={'/'} style={{ textDecoration: 'none', color: '#fff' }}>
            <Button color='inherit'>Dashboard</Button>
          </Link>
          <Button onClick={clickHandler} color='inherit'>
            {login}
          </Button>
        </Toolbar>
      </AppBar>
      <UserDrawer
        close={() => setOpen(false)}
        open={open}
        userList={userList}
      />
    </div>
  )
}

export default Header
