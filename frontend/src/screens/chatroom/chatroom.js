import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'

import { CA } from '../../actions/index'
import { CHAT } from '../../constants'

import { useDispatch, useSelector } from 'react-redux'

import SendIcon from '@material-ui/icons/Send'
import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'

import { SnackbarProvider, useSnackbar } from 'notistack'
import { TextDivider } from '../../components/divider'
import axios from 'axios'

import { Skeleton } from '@material-ui/lab'

import { useStyles } from './styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const Chat = ({ history, match, socket, sendChatroomId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const { enqueueSnackbar } = useSnackbar()

  const [userList, setUserList] = useState([])
  const [oldMsg, setOldMsg] = useState([])

  const [response, setResponse] = useState([])
  const [chatname, setChatname] = useState('Chatroom')

  const myRef = React.useRef()
  const textRef = React.useRef()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const getRoomDetails = useSelector((state) => state.getRoomDetails)
  const { room, loading: loadingRoom } = getRoomDetails

  const getMessages = useSelector((state) => state.getMessages)
  const { messages, loading, error } = getMessages

  const chatroomId = match.params.id

  const scrollToBottom = () => {
    if (myRef.current) {
      myRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    } else {
      return
    }
  }

  useEffect(() => {
    if (userInfo) {
      dispatch(CA.getMessages(chatroomId))
      dispatch(CA.getRoomDetails(chatroomId))
      sendChatroomId(chatroomId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (messages && room) {
      setChatname(room.name)
      messages.reverse().map((i) =>
        setResponse((prev) => [
          ...prev,
          {
            message: i.message,
            name: i.user.name,
            isSender: i.user._id === userInfo._id,
          },
        ])
      )
    }
  }, [messages, userInfo, history, dispatch, chatroomId, room])

  //**************************** socket *********************************//

  useEffect(() => {
    let time = 1000
    setTimeout(() => {
      if (myRef.current === null) {
        time += 1
      } else {
        scrollToBottom()
      }
    }, time)
    if (socket) {
      socket.emit('joinRoom', { chatroomId })
      socket.on('output', (data) => {
        setResponse((prev) => [
          ...prev,
          { ...data, isSender: data.id === userInfo._id },
        ])
        scrollToBottom()
      })
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit('leaveRoom', {
          chatroomId,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('joinRoom', ({ name, users }) => {
        const use = Object.keys(users).map(
          (key) => key.split(',')[0] === chatroomId && key.split(',')[1]
        )

        setUserList(use)
        enqueueSnackbar(`${name} entered`, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'success',
          autoHideDuration: 1000,
        })
      })

      socket.on('leaveRoom', ({ name, users }) => {
        const use = Object.keys(users).map(
          (key) => key.split(',')[0] === chatroomId && key.split(',')[1]
        )

        setUserList(use)
        enqueueSnackbar(`${name} left`, {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          variant: 'error',
          autoHideDuration: 1000,
        })
        dispatch({ type: CHAT.CREATE_ROOM_RESET })
        dispatch({ type: CHAT.GET_MESSAGES_RESET })
        dispatch({ type: CHAT.GET_ROOMS_RESET })
        dispatch({ type: CHAT.GET_ROOM_DETAILS_RESET })
      })
    }
  }, [chatroomId, socket, dispatch, enqueueSnackbar])

  const clickHandler = () => {
    if (socket) {
      socket.emit('input', {
        message: textRef.current.value,
        chatroomId,
        id: userInfo._id,
      })
      textRef.current.value = ''
    }
  }

  const changeHandler = (event) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [showOld, setShowOld] = useState(true)

  const loadOldHandler = async () => {
    setIsLoading(true)
    let skip = 11
    setLimit(limit + 10)
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.get(
      `/api/chatrooms/messages/${chatroomId}?skip=${skip}&limit=${limit}`,
      config
    )

    const newArray = await data.filter((msg) =>
      oldMsg.map((old) => old._id !== msg._id)
    )
    newArray.map(
      (item, index) =>
        (newArray[index].isSender = item.user._id === userInfo._id)
    )
    setOldMsg([...newArray.reverse()])
    setIsLoading(false)
    if (data.length === oldMsg.length) {
      setShowOld(false)
    }
  }

  return loading || loadingRoom ? (
    <ModalLoader />
  ) : error ? (
    <ModalMessage variant='error'>{error}</ModalMessage>
  ) : (
    <Grid container justify='center' style={{ padding: 20 }}>
      {!sm && (
        <Grid item xs={3}>
          <Paper
            elevation={12}
            style={{ padding: 20, height: '75vh', overflow: 'auto' }}
          >
            <Typography variant='h6'>Online Users</Typography>
            {userList.map((user, index) => (
              <p key={index}>{user}</p>
            ))}
          </Paper>
        </Grid>
      )}

      <Grid item xs={12} sm={8} style={{ margin: 'auto' }}>
        <Card elevation={12} className={classes.card}>
          <Grid container alignItems='center'>
            <Grid item xs={8}>
              <CardHeader
                title={chatname}
                subheader={new Date().toDateString()}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              {sm ? (
                <IconButton onClick={() => history.push('/')}>
                  <ExitToAppIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<ExitToAppIcon />}
                  onClick={() => history.push('/')}
                >
                  Dashboard
                </Button>
              )}
            </Grid>
          </Grid>
          <CardContent style={{ height: '50vh', overflow: 'hidden' }}>
            <Paper
              variant='outlined'
              style={{
                height: '100%',
                overflow: 'auto',
                padding: 5,
                textAlign: 'right',
              }}
            >
              <Box style={{ padding: 15 }}>
                {room && room.messages.length > 9 && showOld && (
                  <TextDivider>
                    <IconButton
                      onClick={loadOldHandler}
                      style={{ textTransform: 'none', fontSize: 12 }}
                    >
                      load old messages
                    </IconButton>
                  </TextDivider>
                )}

                {isLoading ? (
                  <>
                    <Skeleton
                      variant='rect'
                      style={{
                        padding: '10px 0',
                        margin: '10px 0',
                        width: '80%',
                      }}
                    />
                    <Skeleton
                      variant='rect'
                      style={{
                        padding: '10px 0',
                        margin: '10px 0',
                        width: '80%',
                        marginLeft: 'auto',
                      }}
                    />
                    <Skeleton
                      variant='rect'
                      style={{
                        padding: '10px 0',
                        margin: '10px 0',
                        width: '80%',
                      }}
                    />
                  </>
                ) : (
                  oldMsg.map((text, index) => (
                    <Paper
                      elevation={12}
                      key={index}
                      className={
                        text.isSender ? classes.sender : classes.reciever
                      }
                      style={{
                        padding: '5px 0',
                        margin: '10px 0',
                        width: '80%',
                      }}
                    >
                      <Typography variant='body1' className={classes.text}>
                        {text.user.name.split(' ')[0]}
                      </Typography>
                      <Typography variant='body2' className={classes.text}>
                        {text.message}
                      </Typography>
                    </Paper>
                  ))
                )}

                {response.map((text, index) => (
                  <Paper
                    elevation={12}
                    key={index}
                    className={
                      text.isSender ? classes.sender : classes.reciever
                    }
                    style={{ padding: '5px 0', margin: '10px 0', width: '80%' }}
                  >
                    <Typography variant='body1' className={classes.text}>
                      {text.name.split(' ')[0]}
                    </Typography>
                    <Typography variant='body2' className={classes.text}>
                      {text.message}
                    </Typography>
                  </Paper>
                ))}

                <div
                  ref={myRef}
                  style={{ float: 'right', clear: 'both', padding: 10 }}
                />
              </Box>
            </Paper>
          </CardContent>

          <CardActions>
            <Paper className={classes.root}>
              <InputBase
                inputRef={textRef}
                className={classes.input}
                placeholder='Type Here'
                type='text'
                onKeyUp={changeHandler}
              />
              <IconButton className={classes.iconButton} onClick={clickHandler}>
                <SendIcon />
              </IconButton>
            </Paper>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export const Chatroom = ({ history, match, socket, sendChatroomId }) => {
  return (
    <SnackbarProvider maxSnack={6}>
      <Chat
        history={history}
        match={match}
        socket={socket}
        sendChatroomId={sendChatroomId}
      />
    </SnackbarProvider>
  )
}
