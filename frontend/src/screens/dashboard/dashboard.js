import React from 'react'
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'

import { CA } from '../../actions/index'
import { CHAT } from '../../constants/index'

import ChatIcon from '@material-ui/icons/Chat'
import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'
import { useStyles } from './styles'

import { SnackbarProvider, useSnackbar } from 'notistack'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import axios from 'axios'

const Handler = ({ history }) => {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const dispatch = useDispatch()
  const [chatrooms, setChatrooms] = React.useState([])
  const [name, setName] = React.useState('')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading: loadingUser } = userLogin

  const createRoom = useSelector((state) => state.createRoom)
  const { success, error: errorCreate } = createRoom

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
      setChatrooms(rooms)
    }
    if (success) {
      enqueueSnackbar(`Chatroom ${name} created`, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
        autoHideDuration: 3000,
        onEntered: () => {
          setName('')
          dispatch(CA.getRooms())
          dispatch({ type: CHAT.CREATE_ROOM_RESET })
        },
      })
    }
  }, [
    chatrooms,
    rooms,
    userInfo,
    history,
    success,
    enqueueSnackbar,
    name,
    dispatch,
  ])

  const clickHandler = (id) => {
    history.push(`/chatroom/${id}`)
  }

  const deleteHandler = async (id, chatroomName) => {
    if (window.confirm(`Delete ${chatroomName}?`)) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
        const { data } = await axios.delete(`/api/chatrooms/${id}`, config)
        console.log(data)
        if (data.status === 202) {
          enqueueSnackbar(`Chatroom ${chatroomName} deleted`, {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'error',
            autoHideDuration: 3000,
            onEntered: () => {
              dispatch(CA.getRooms())
            },
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  const editHandler = (params) => {}

  return loading || loadingUser ? (
    <ModalLoader />
  ) : (
    <Container
      style={{ position: 'relative', maxHeight: '90vh', overflow: 'hidden' }}
    >
      {error ? (
        <ModalMessage variant='error'>{error}</ModalMessage>
      ) : (
        errorCreate && (
          <ModalMessage variant='error'>{errorCreate}</ModalMessage>
        )
      )}
      <Paper
        elevation={12}
        style={{ padding: 20, margin: '20px auto', height: '80vh' }}
      >
        <Grid container justify='center' spacing={3}>
          <Grid xs={12} item>
            <Typography variant='h4' style={{ textAlign: 'center' }}>
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={12}
              style={{ marginTop: 20, padding: 20, textAlign: 'center' }}
            >
              <form onSubmit={submitHandler}>
                <TextField
                  style={{ boxShadow: '2px 3px #ccc' }}
                  type='text'
                  variant='outlined'
                  margin='normal'
                  required
                  fullWidth
                  label='Chatroom Name'
                  name='chatroom'
                  onChange={(e) => setName(e.target.value)}
                />
                <Button variant='contained' color='primary' type='submit'>
                  Create Chatroom
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{ height: '80%', position: 'relative' }}
          >
            <Paper
              elevation={12}
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '20px auto',
                height: '100%',
              }}
            >
              <Grid
                xs={12}
                item
                container
                alignContent='center'
                justify='center'
                style={{ maxHeight: '100%', overflow: 'auto' }}
              >
                <Typography
                  variant='h5'
                  style={{
                    textAlign: 'center',
                    padding: 10,
                  }}
                >
                  Chatrooms
                </Typography>
              </Grid>
              <Paper
                style={{
                  padding: 20,
                  margin: 10,
                  border: '2px solid #ccc',
                  boxShadow: '3px 4px #eee',
                  height: '26vh',
                  backgroundColor: 'ButtonShadow',
                  overflow: 'auto',
                }}
              >
                <Grid
                  container
                  justify='center'
                  // alignItems='center'
                  spacing={2}
                  style={{ overflow: 'auto', maxHeight: '100%', padding: 5 }}
                >
                  {chatrooms.length > 0 &&
                    chatrooms.map((chatroom) => (
                      <Paper
                        elevation={4}
                        style={{
                          width: '100%',
                          margin: '8px auto',
                          maxHeight: '90px',
                        }}
                        key={chatroom._id}
                      >
                        <Grid container justify='center' alignItems='center'>
                          <Grid item xs={8} md={6}>
                            <Typography
                              variant='h6'
                              style={{ textAlign: 'center' }}
                            >
                              {chatroom.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} md={2}>
                            {sm ? (
                              <IconButton
                                onClick={() => clickHandler(chatroom._id)}
                                color='inherit'
                              >
                                <ChatIcon />
                              </IconButton>
                            ) : (
                              <Button
                                onClick={() => clickHandler(chatroom._id)}
                                variant='outlined'
                                className={classes.button}
                                startIcon={<ChatIcon fontSize='large' />}
                              >
                                Join
                              </Button>
                            )}
                          </Grid>
                          <Grid
                            item
                            container
                            justify='center'
                            alignItems='center'
                            xs={6}
                            sm={6}
                            lg={2}
                          >
                            <Typography
                              variant='caption'
                              style={{ padding: 5 }}
                            >
                              {` ${chatroom.users.length}  ${
                                chatroom.users.length > 1 ? 'users' : 'user'
                              }`}
                            </Typography>
                          </Grid>
                          {userInfo.isAdmin && (
                            <>
                              <Grid item xs={3} sm={2} md={1}>
                                <IconButton
                                  color='primary'
                                  onClick={() => editHandler(chatroom._id)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Grid>
                              <Grid item xs={3} sm={2} md={1}>
                                <IconButton
                                  color='secondary'
                                  onClick={() =>
                                    deleteHandler(chatroom._id, chatroom.name)
                                  }
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Paper>
                    ))}
                </Grid>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export const Dashboard = ({ history, match }) => {
  return (
    <SnackbarProvider maxSnack={6}>
      <Handler history={history} match={match} />
    </SnackbarProvider>
  )
}
