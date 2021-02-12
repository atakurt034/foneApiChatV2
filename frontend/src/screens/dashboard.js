import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'

import { CA } from '../actions/index'
import { CHAT } from '../constants/index'

import ChatIcon from '@material-ui/icons/Chat'
import { ModalLoader } from '../components/ModalLoader'
import Message from '../components/Message'

export const Dashboard = ({ history }) => {
  const dispatch = useDispatch()
  const [chatrooms, setChatrooms] = React.useState([])
  const [name, setName] = React.useState('')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading: loadingUser } = userLogin

  const createRoom = useSelector((state) => state.createRoom)
  const { success } = createRoom

  const getRooms = useSelector((state) => state.getRooms)
  const { error, loading, rooms } = getRooms

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(CA.createRoom(name))
  }

  React.useEffect(() => {
    if (userInfo) {
      dispatch(CA.getRooms())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (rooms) {
      setChatrooms(rooms.reverse())
    }
    if (success) {
      setName('')
      dispatch(CA.getRooms())
      dispatch({ type: CHAT.CREATE_ROOM_RESET })
    }
  }, [chatrooms, rooms, userInfo, history, success, dispatch])

  return loading || loadingUser ? (
    <ModalLoader />
  ) : error ? (
    <Message variant='error'>{error}</Message>
  ) : (
    <Container>
      <Paper
        elevation={12}
        style={{ padding: 20, marginTop: 20, height: '80vh', overflow: 'auto' }}
      >
        <Grid container justify='center' spacing={3}>
          <Grid xs={12} item>
            <Typography variant='h4' style={{ textAlign: 'center' }}>
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Paper
              elevation={12}
              style={{ marginTop: 20, padding: 20, textAlign: 'center' }}
            >
              <form onSubmit={submitHandler}>
                <TextField
                  type='text'
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  label='Chatroom Name'
                  name='chatroom'
                  onChange={(e) => setName(e.target.value)}
                />
                <Button variant='contained' type='submit'>
                  Create Chatroom
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              elevation={12}
              style={{
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                height: '80%',
                marginTop: 20,
              }}
            >
              <Grid xs={12} item>
                <Typography variant='h6' style={{ textAlign: 'center' }}>
                  Chatrooms
                </Typography>
              </Grid>
              {chatrooms.length > 0 &&
                chatrooms.map((chatroom) => (
                  <Typography key={chatroom._id} style={{ padding: 5 }}>
                    <Link
                      to={`/chatroom/${chatroom._id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant='outlined' startIcon={<ChatIcon />}>
                        <div>{chatroom.name}</div>
                      </Button>
                    </Link>
                  </Typography>
                ))}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
