import React from 'react'

import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Container,
  Avatar,
} from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'
import { USER as UC } from '../../constants/index'

import { CMP } from '../../components/index'

import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'
import axios from 'axios'

export const Profile = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { details, loading, error } = useSelector((state) => state.userDetails)
  const { status, loading: loadingUpdate, error: errorUpadate } = useSelector(
    (state) => state.userUpdate
  )

  const [user, setUser] = React.useState({})
  const { name, email, image, password, confirmPassword } = user

  const submitHandler = (event) => {
    event.preventDefault()
    if (password === confirmPassword) {
      dispatch(UA.userUpdateProfile({ name, image, email, password }))
    } else {
      CMP.makeToast('error', 'Passwords do not match', 'notification')
    }
  }

  const changeHandler = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const imageHandler = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const form = new FormData()
    form.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    try {
      const { data } = await axios.post(
        `/api/users/uploads/avatar`,
        form,
        config
      )
      const path = data.file.path.split('public')[1]
      setUser({ ...user, image: path })
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if (!details) {
      dispatch(UA.getUserDetails())
    }
    if (details) {
      setUser(details)
    }
    if (status === 200) {
      CMP.makeToast('success', 'Updated', 'notification')
      dispatch(UA.getUserDetails())
      dispatch({ type: UC.UPDATE_RESET })
    }
  }, [dispatch, details, status])

  return loading || loadingUpdate ? (
    <ModalLoader />
  ) : error ? (
    <ModalMessage variant='erro'>{error}</ModalMessage>
  ) : errorUpadate ? (
    <ModalMessage variant='error'>{errorUpadate}</ModalMessage>
  ) : (
    <Grid
      container
      justify='center'
      style={{ margin: '20px auto', padding: 10 }}
    >
      <Grid item xs={12}>
        <Card elevation={12}>
          <CardHeader title='Info' />
          <Divider />
          <CardContent style={{ textAlign: 'center' }}>
            <input
              type='file'
              id='imageInput'
              accept='image/*'
              hidden
              onChange={imageHandler}
            />
            <label htmlFor='imageInput'>
              <Button
                style={{ height: '20vw', width: '20vw', borderRadius: '50%' }}
                component='span'
              >
                <Avatar
                  src={image}
                  alt={name}
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
              <form onSubmit={submitHandler}>
                <Grid container spacing={2} style={{ padding: 20 }}>
                  <Grid item xs={12}>
                    <TextField
                      name='name'
                      variant='outlined'
                      required
                      fullWidth
                      id='name'
                      label='Name'
                      value={name}
                      onChange={changeHandler}
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
                      value={email}
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      fullWidth
                      name='password'
                      label='Password'
                      type='password'
                      id='password'
                      onChange={changeHandler}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant='outlined'
                      fullWidth
                      name='confirmPassword'
                      label='Confrim Password'
                      type='password'
                      id='confirmPassword'
                      onChange={changeHandler}
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
