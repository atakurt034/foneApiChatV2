import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../actions/index'

import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { withRouter } from 'react-router-dom'

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

const Header = ({ history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [login, setLogin] = React.useState()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading } = userLogin

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

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <Avatar />
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
    </div>
  )
}

export default withRouter(Header)
