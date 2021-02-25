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

import { Confirm, FormDialog } from '../../components/dialog'

const Handler = ({ history, socket }) => {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, loading: loadingUser } = userLogin

  const createRoom = useSelector((state) => state.createRoom)
  const { success, error: errorCreate } = createRoom

  const getRooms = useSelector((state) => state.getRooms)
  const { error, loading, rooms } = getRooms

  const deleteRoom = useSelector((state) => state.deleteRoom)
  const { status, error: errorDelete } = deleteRoom

  const editRoom = useSelector((state) => state.editRoom)
  const { status: statusEdit, error: errorEdit } = editRoom

  const [chatrooms, setChatrooms] = React.useState([])
  const [name, setName] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [deleteData, setDeleteData] = React.useState({})
  const [openForm, setOpenForm] = React.useState(false)
  const [editData, setEditData] = React.useState({})

  const submitHandler = (event) => {
    event.preventDefault()
    dispatch(CA.createRoom(name))
  }

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (userInfo) {
      dispatch(CA.getRooms())
    }
    if (status) {
      if (status.status === 202) {
        enqueueSnackbar(`Chatroom ${deleteData.chatroomName} deleted`, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
          autoHideDuration: 3000,
          onEntered: () => {
            dispatch(CA.getRooms())
            dispatch({ type: CHAT.DELETE_ROOM_RESET })
          },
        })
      }
    }
    if (statusEdit) {
      if (statusEdit.status === 202) {
        enqueueSnackbar(
          `Chatroom ${editData.chatroomName} edited to ${editData.name}`,
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
            variant: 'info',
            autoHideDuration: 3000,
            onEntered: () => {
              dispatch(CA.getRooms())
              dispatch({ type: CHAT.EDIT_ROOM_RESET })
            },
          }
        )
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRoom, enqueueSnackbar, status, statusEdit])

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

  const clickHandler = (id) => {
    history.push(`/chatroom/${id}`)
  }

  const resultHandler = (e) => {
    if (e) {
      dispatch(CA.deleteRoom(deleteData.id, deleteData.chatroomName))
    }
    setOpen(false)
  }

  const deleteResultHandler = (id, chatroomName) => {
    setOpen(true)
    setDeleteData({ id, chatroomName })
  }

  const editRecievedHandler = (e, name) => {
    setEditData({ ...editData, name: name })
    if (e) {
      dispatch(CA.editRoom(editData.id, name))
    }
    setOpenForm(false)
  }

  const editDataHandler = (id, chatroomName) => {
    setOpenForm(true)
    setEditData({ id, chatroomName })
  }

  return loading || loadingUser || !userInfo ? (
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
      {error ? (
        <ModalMessage variant='error'>{error}</ModalMessage>
      ) : errorCreate ? (
        <ModalMessage variant='error'>{errorCreate}</ModalMessage>
      ) : errorDelete ? (
        <ModalMessage variant='error'>{errorDelete}</ModalMessage>
      ) : (
        errorEdit && <ModalMessage variant='error'>{errorEdit}</ModalMessage>
      )}
      <Paper
        elevation={12}
        style={{ padding: 20, margin: '20px auto', height: '100%' }}
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
                  style={{ boxShadow: '2px 3px #ccc', borderRadius: 5 }}
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
                  Public Chatrooms
                </Typography>
              </Grid>
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
                            md={4}
                          >
                            <Typography
                              variant='caption'
                              style={{ padding: 5 }}
                            >
                              {`${
                                datas.filter(
                                  (data) => data.chatroomId === chatroom._id
                                ).length
                              } ${
                                datas.filter(
                                  (data) => data.chatroomId === chatroom._id
                                ).length > 1
                                  ? 'users online'
                                  : 'user online'
                              }`}
                            </Typography>
                          </Grid>
                          {userInfo.isAdmin && (
                            <>
                              <Grid item xs={3} sm={2} md={1}>
                                <IconButton
                                  color='primary'
                                  onClick={() =>
                                    editDataHandler(chatroom._id, chatroom.name)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Grid>
                              <Grid item xs={3} sm={2} md={1}>
                                <IconButton
                                  color='secondary'
                                  onClick={() =>
                                    deleteResultHandler(
                                      chatroom._id,
                                      chatroom.name
                                    )
                                  }
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Grid>
                              <Confirm
                                clicked={open}
                                closed={() => setOpen(false)}
                                result={resultHandler}
                                data={deleteData.chatroomName}
                              />
                              <FormDialog
                                handleClose={() => setOpenForm(false)}
                                open={openForm}
                                editData={editRecievedHandler}
                                chatroomName={editData.chatroomName}
                              />
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

export const Dashboard = ({ socket, history }) => {
  return (
    <SnackbarProvider maxSnack={6}>
      <Handler socket={socket} history={history} />
    </SnackbarProvider>
  )
}
