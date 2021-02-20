import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useStyles } from './lsStyle'

import { useSelector, useDispatch } from 'react-redux'
import { UA } from '../../actions/index'
import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'

export const LoginScreen = ({ history }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading, error } = userLogin

  React.useEffect(() => {
    if (userInfo && !loading) {
      history.push('/')
    }
  }, [history, userInfo, loading])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(UA.login({ email, password }))
  }

  const classes = useStyles()

  return (
    <Container component='div' maxWidth='xs'>
      <CssBaseline />
      {loading && <ModalLoader />}
      {error && <ModalMessage variant='error'>{error}</ModalMessage>}
      <Paper elevation={12} className={classes.paper}>
        <Typography
          className={classes.icon}
          gutterBottom
          component='h1'
          variant='h5'
        >
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />{' '}
          </Avatar>{' '}
          Sign in with
        </Typography>

        <form onSubmit={submitHandler} className={classes.form} noValidate>
          <TextField
            type='email'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs={6}>
              <Link to='/forgot'>
                <Typography variant='body2' style={{ fontSize: '0.8rem' }}>
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Link to={'/register'}>
                <Typography
                  variant='body2'
                  style={{ textAlign: 'center', fontSize: '0.8rem' }}
                >
                  {"Don't have an account? "}
                </Typography>
                <Typography
                  variant='body2'
                  style={{ textAlign: 'center', fontSize: '0.8rem' }}
                >
                  {'Sign Up'}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}
