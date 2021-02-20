import React from 'react'

import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  Button,
  TextField,
  Container,
} from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'

import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'

export const Profile = () => {
  const dispatch = useDispatch()

  const { details, loading, error } = useSelector((state) => state.userDetails)

  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    if (!details) {
      dispatch(UA.getUserDetails())
    }
    if (details) {
      setUser(details)
    }
  }, [dispatch, details])

  return loading ? (
    <ModalLoader />
  ) : error ? (
    <ModalMessage variant='erro'>{error}</ModalMessage>
  ) : (
    <Grid justify='center' style={{ margin: '20px auto', padding: 10 }}>
      <Grid item xs={12}>
        <Card elevation={12}>
          <CardHeader title='Info' />
          <Divider />
          <CardContent style={{ textAlign: 'center' }}>
            <input
              type='file'
              id='imageInput'
              accept='image/*'
              style={{
                // position: 'absolute',
                // zIndex: 2,
                // width: '20vw',
                // height: '20vw',
                display: 'none',
              }}
            />
            <label htmlFor='imageInput'>
              <Button
                style={{ height: '20vw', width: '20vw', borderRadius: '50%' }}
                component='span'
              >
                <Avatar
                  src={user.image}
                  alt={user.name}
                  style={{
                    height: '20vw',
                    width: '20vw',
                    margin: 'auto',
                  }}
                />
              </Button>
            </label>
          </CardContent>
          <CardActions>
            <Container maxWidth='sm' style={{ margin: '5px auto' }}>
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      variant='outlined'
                      required
                      fullWidth
                      id='name'
                      label='Name'
                      value={user.name}
                      onChange={(e) => setUser({ name: e.target.value })}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      required
                      fullWidth
                      id='email'
                      label='Email Address'
                      name='email'
                      value={user.email}
                      onChange={(e) => setUser({ email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      required
                      fullWidth
                      name='password'
                      label='Password'
                      type='password'
                      id='password'
                      autoComplete='current-password'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      required
                      fullWidth
                      name='confirmPassword'
                      label='Confrim Password'
                      type='password'
                      id='confirmPassword'
                    />
                  </Grid>
                  <Grid item container justify='center' xs={12}>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      style={{ width: '50%' }}
                    >
                      save
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Container>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}
