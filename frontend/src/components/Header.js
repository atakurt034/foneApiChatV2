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
  Grid,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { UserDrawer } from './drawer'
import ListIcon from '@material-ui/icons/List'

import Account from './NavItems/Account/Account'

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
  brand: {
    flex: 1,
    width: 'auto',
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
    <AppBar position='static'>
      <Toolbar>
        <Grid className={classes.brand}>Chat App</Grid>
        {<Account socket={socket} />}
      </Toolbar>
    </AppBar>
  )
}

export default Header
