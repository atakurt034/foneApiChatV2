import React from 'react'
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'

import { useSelector } from 'react-redux'

import ChatIcon from '@material-ui/icons/Chat'
import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'
import { useStyles } from './styles'

import { SnackbarProvider, useSnackbar } from 'notistack'
import axios from 'axios'

const Handler = ({ history, socket }) => {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading, error } = userLogin

  const [chatrooms, setChatrooms] = React.useState([])
  const [rooms, setRooms] = React.useState([])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (userInfo) {
      const getPrvtRooms = async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'applicaton/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          }

          const { data } = await axios.get(
            `/api/chatrooms/private/${userInfo._id}`,
            config
          )
          setRooms(data.privateRooms)
        } catch (error) {
          console.log(error)
        }
      }
      getPrvtRooms()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (rooms) {
      const private_rooms = rooms.map((room, index) => {
        return {
          ...room,
          name: room.users.map(
            (x, userIndex) => x._id !== userInfo._id && x.name
          ),
        }
      })
      setChatrooms(private_rooms)
    }
  }, [rooms, userInfo, history])

  const [datas, setDatas] = React.useState([])

  React.useEffect(() => {
    if (socket) {
      socket.on('publicJoin', (data) => {
        setDatas(Object.values(data))
      })
      socket.on('publicLeave', (data) => {
        setDatas(Object.values(data))
      })
    }
  }, [socket, datas])

  const clickHandler = (user) => {
    const name = user.name.find((x) => typeof x === 'string')
    history.push(`/user/${name}?id=${user._id}`)
  }

  return loading || !userInfo || typeof window === 'undefined' ? (
    <ModalLoader />
  ) : (
    <Container
      style={{
        position: 'relative',
        maxHeight: '100%',
        overflow: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {error && <ModalMessage variant='error'>{error}</ModalMessage>}
      <Paper
        elevation={12}
        style={{ padding: 20, margin: '20px auto', height: '100%' }}
      >
        <Grid container justify='center' spacing={3}>
          <Grid xs={12} item>
            <Typography variant='h4' style={{ textAlign: 'center' }}>
              Private Rooms
            </Typography>
          </Grid>

          <Grid item xs={12} style={{ height: '80%', position: 'relative' }}>
            <Paper
              elevation={12}
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '20px auto',
                height: '100%',
              }}
            >
              <Paper
                style={{
                  padding: 20,
                  margin: 10,
                  border: '2px solid #ccc',
                  boxShadow: '3px 4px #eee',
                  height: '50vh',
                  backgroundColor: 'ButtonShadow',
                }}
              >
                <Grid
                  container
                  justify='center'
                  spacing={2}
                  style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: '100%',
                    padding: 5,
                  }}
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
                        <Grid
                          container
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Grid item xs={8} md={4}>
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
                                onClick={() => clickHandler(chatroom)}
                                variant='outlined'
                                className={classes.button}
                                startIcon={<ChatIcon fontSize='large' />}
                              >
                                Join
                              </Button>
                            )}
                          </Grid>
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

export const PrivateRoom = ({ socket, history }) => {
  return (
    <SnackbarProvider maxSnack={6}>
      <Handler socket={socket} history={history} />
    </SnackbarProvider>
  )
}
