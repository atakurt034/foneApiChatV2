import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

import { CA } from '../../actions/index'

import { useDispatch, useSelector } from 'react-redux'

import SendIcon from '@material-ui/icons/Send'
import { ModalLoader } from '../../components/ModalLoader'
import { ModalMessage } from '../../components/ModalMessage'
import { hidden } from 'colors'

import Toast from '../../components/toaster'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    margin: 10,
  },
  input: {
    width: '100%',
    margin: 10,
  },
  iconButton: {
    padding: 10,
  },
  card: {
    backgroundColor: '#eee',
  },
  sender: {
    backgroundColor: 'Highlight',
    textAlign: 'right',
    float: 'right',
    clear: 'both',
  },
  reciever: { textAlign: 'left', float: 'left' },
  text: { margin: '0 10px' },
}))

export const Chatroom = ({ history, match }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [userList, setUserList] = useState([])

  const [message, setMessage] = useState()
  const [response, setResponse] = useState([])
  const [chatname, setChatname] = useState('Chatroom')

  const myRef = React.useRef()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const getRoomDetails = useSelector((state) => state.getRoomDetails)
  const { room, loading, error } = getRoomDetails

  const chatroomId = match.params.id

  useEffect(() => {
    if (userInfo) {
      dispatch(CA.getRoomDetails(chatroomId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (room) {
      setChatname(room.name)
      room.messages.map((i) =>
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
  }, [userInfo, history, dispatch, room])

  //**************************** socket *********************************//

  const socket = io('http://192.168.254.111:5000', {
    query: { token: userInfo.token, room: chatroomId },
  })
  socket.connect()

  const scrollToBottom = () => {
    myRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', { chatroomId })
    }
    socket.on('output', (data) => {
      setResponse((prev) => [
        ...prev,
        { ...data, isSender: data.id === userInfo._id },
      ])
      setMessage('')
      scrollToBottom()
    })

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
    socket.on('joinRoom', ({ name, users }) => {
      Toast('success', `${name} entered`, 'notification')
      setUserList(Object.values(users))
    })

    socket.on('leaveRoom', ({ name, users }) => {
      Toast('error', `${name} left`, 'notification')
      setUserList(Object.values(users))
    })
  }, [socket])

  const clickHandler = () => {
    socket.emit('input', { message, chatroomId, id: userInfo._id })
  }

  const changeHandler = (event) => {
    const { key, keyCode, target } = event
    const { value } = target
    setMessage(value)
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      clickHandler()
    }
  }

  return loading ? (
    <ModalLoader />
  ) : error ? (
    <ModalMessage variant='error'>{error}</ModalMessage>
  ) : (
    <Grid container justify='center' style={{ padding: 20 }}>
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
      <Grid item xs={8} style={{ margin: 'auto' }}>
        <Card elevation={12} className={classes.card}>
          <CardHeader title={chatname} subheader={new Date().toDateString()} />
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
              <Box style={{ padding: 10 }}>
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
              </Box>
              <div ref={myRef} style={{ float: 'right', clear: 'both' }}></div>
            </Paper>
          </CardContent>

          <CardActions>
            <Paper className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder='Type Here'
                type='text'
                value={message}
                onChange={changeHandler}
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
