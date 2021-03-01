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

import { UA } from '../../actions/index'
import { CHAT } from '../../constants/index'

import { useDispatch, useSelector } from 'react-redux'

import SendIcon from '@material-ui/icons/Send'
import { ModalMessage } from '../../components/ModalMessage'

import { TextDivider } from '../../components/divider'
import axios from 'axios'

import { useStyles } from './styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { ChipUser } from '../../components/user/userChip'
import { SkeletonChat } from '../../components/skeletonChat'

export const UserChat = ({ history, match, socket, sendChatroomId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const [oldMsg, setOldMsg] = useState([])
  const [chatroomId, setChatroomId] = useState('')

  const [response, setResponse] = useState([])
  const [chatname, setChatname] = useState('Chatroom')
  const [rooms, setRooms] = useState({ messages: [] })

  const myRef = React.useRef()
  const textRef = React.useRef()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const { rooms: private_room, loading, error } = useSelector(
    (state) => state.privateRooms
  )

  const name = match.params.name
  const id = history.location.search.split('=')[1]

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
    if (private_room) {
      setRooms(private_room)
      sendChatroomId(chatroomId)
      setChatroomId(private_room._id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [private_room, rooms])

  useEffect(() => {
    dispatch(UA.getPrivateRooms(id))
    if (!loading) {
      dispatch(UA.getPrvtMsgCount())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (rooms) {
      setChatname(name)
      rooms.messages.map((i) =>
        setResponse((prev) => [
          ...prev,
          {
            message: i.message,
            name: i.user.name,
            image: i.user.image,
            isSender: i.user._id === userInfo._id,
          },
        ])
      )
    }
  }, [userInfo, history, rooms, name])

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

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit('privateLeave', {
          chatroomId,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId, socket, userInfo])

  useEffect(() => {
    if (socket) {
      socket.emit('privateJoin', { chatroomId })
      socket.on('privateOutput', (data) => {
        setResponse((prev) => [
          ...prev,
          { ...data, isSender: data.id === userInfo._id },
        ])
        scrollToBottom()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    return () => {
      dispatch({ type: CHAT.CREATE_ROOM_RESET })
      dispatch({ type: CHAT.GET_MESSAGES_RESET })
      dispatch({ type: CHAT.GET_ROOMS_RESET })
      dispatch({ type: CHAT.GET_ROOM_DETAILS_RESET })
      dispatch(UA.getPrvtMsgCount())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clickHandler = () => {
    if (socket) {
      socket.emit('privateInput', {
        message: textRef.current.value,
        name: userInfo.name,
        image: userInfo.image,
        chatroomId,
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
      `/api/chatrooms/messages/${rooms._id}?skip=${skip}&limit=${limit}`,
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

  return error ? (
    <ModalMessage variant='error'>{error}</ModalMessage>
  ) : (
    <Grid container justify='center' style={{ padding: 20 }}>
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
                <>
                  <IconButton onClick={() => history.push('/')} title='exit'>
                    <ExitToAppIcon />
                  </IconButton>
                </>
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
                {rooms.messages.length > 9 && showOld && (
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
                  <SkeletonChat />
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

                {loading ? (
                  <>
                    <SkeletonChat />
                    <SkeletonChat />
                    <SkeletonChat />
                  </>
                ) : (
                  response.map((text, index) => (
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
                      <ChipUser
                        text={text}
                        history={history}
                        socket={socket}
                        chatroomId={chatroomId}
                      />

                      <Typography variant='body2' className={classes.text}>
                        {text.message}
                      </Typography>
                    </Paper>
                  ))
                )}

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
