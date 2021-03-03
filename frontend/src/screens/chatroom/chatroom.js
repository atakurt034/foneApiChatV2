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
import SendIcon from '@material-ui/icons/Send'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ListIcon from '@material-ui/icons/List'

import React from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useStyles } from './styles'
import { CA } from '../../actions/index'
import { filter, snacks, chat, reset } from '../../lib/index'

import { CMP } from '../../components/index'
import './styles.scss'

const Chat = ({ history, match, socket, sendChatroomId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('sm'))

  const [status, setStatus] = React.useState(true)

  const [userList, setUserList] = React.useState([])
  const [oldMsg, setOldMsg] = React.useState([])

  const [response, setResponse] = React.useState([])
  const [chatname, setChatname] = React.useState()

  const myRef = React.useRef()
  const textRef = React.useRef()

  const { userInfo } = useSelector((state) => state.userLogin)

  const { room, loading: loadingRoom } = useSelector(
    (state) => state.getRoomDetails
  )

  const { messages, loading } = useSelector((state) => state.getMessages)

  const chatroomId = match.params.id

  React.useEffect(() => {
    if (userInfo) {
      dispatch(CA.getMessages(chatroomId))
      dispatch(CA.getRoomDetails(chatroomId))
      sendChatroomId(chatroomId)
    }
    return () => {
      setChatname()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo, chatroomId, sendChatroomId])

  React.useEffect(() => {
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
            image: i.user.image,
            isMine: i.user._id === userInfo._id,
            id: i.user._id,
          },
        ])
      )
    }
  }, [messages, userInfo, history, chatroomId, room])

  //**************************** socket *********************************//

  React.useEffect(() => {
    let time = 1000
    setTimeout(() => {
      if (myRef.current === null) {
        time += 1
      } else {
        chat.scrollToBottom(myRef)
      }
    }, time)
    if (socket) {
      socket.emit('joinRoom', { chatroomId })
      socket.on('output', (data) => {
        setResponse((prev) => [
          ...prev,
          {
            ...data,
            isMine: data.id === userInfo._id,
          },
        ])
        chat.scrollToBottom(myRef)
      })
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit('leaveRoom', {
          chatroomId,
        })
      }
      reset.reset(dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userInfo])

  React.useEffect(() => {
    if (socket) {
      socket.on('joinRoom', ({ name, users }) => {
        const use = filter.room(users, chatroomId)

        setUserList(use)
        status &&
          snacks.Snacks(
            name,
            'entered',
            enqueueSnackbar,
            [loading, loadingRoom],
            setStatus
          )
      })

      socket.on('leaveRoom', ({ name, users }) => {
        const use = filter.room(users, chatroomId)

        setUserList(use)
        status &&
          snacks.Snacks(
            name,
            'left',
            enqueueSnackbar,
            [loading, loadingRoom],
            setStatus
          )
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId, socket])

  const clickHandler = () => {
    if (socket) {
      socket.emit('input', {
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

  const [isLoading, setIsLoading] = React.useState(false)
  const [limit, setLimit] = React.useState(10)
  const [showOld, setShowOld] = React.useState(true)
  const [open, setOpen] = React.useState(false)

  return (
    <Grid container justify='center' style={{ padding: 20 }}>
      {!sm && (
        <Grid item xs={3}>
          <Paper
            elevation={12}
            style={{ padding: 20, height: '75vh', overflow: 'auto' }}
          >
            <Typography variant='h6'>Online Users</Typography>
            {userList.map((user, index) => (
              <CMP.UserMenu
                user={user}
                history={history}
                chatroomId={chatroomId}
                socket={socket}
                key={index}
              />
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
                <>
                  <IconButton onClick={() => setOpen(true)}>
                    <ListIcon />
                  </IconButton>
                  <IconButton onClick={() => history.push('/')} title='exit'>
                    <ExitToAppIcon />
                  </IconButton>
                  <CMP.UserDrawer
                    chatroomId={chatroomId}
                    history={history}
                    socket={socket}
                    userList={userList}
                    close={() => setOpen(false)}
                    open={open}
                  />
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
            <Paper className='chat' variant='outlined'>
              <Box style={{ padding: 15 }}>
                {room && room.messages.length > 9 && showOld && (
                  <CMP.TextDivider>
                    <IconButton
                      onClick={chat.loadOldHandler(
                        setIsLoading,
                        setLimit,
                        limit,
                        userInfo,
                        chatroomId,
                        oldMsg,
                        setOldMsg,
                        setShowOld
                      )}
                      style={{ textTransform: 'none', fontSize: 12 }}
                    >
                      load old messages
                    </IconButton>
                  </CMP.TextDivider>
                )}

                {isLoading ? (
                  <>
                    <CMP.SkeletonChat />
                    <CMP.SkeletonChat />
                    <CMP.SkeletonChat />
                    <CMP.SkeletonChat />
                  </>
                ) : (
                  oldMsg.map((text, index) => (
                    <Box
                      key={index}
                      className={
                        text.isMine ? 'mine messages' : 'yours messages'
                      }
                    >
                      <Paper
                        style={{ borderRadius: 20 }}
                        className={'message last'}
                      >
                        {!text.isMine && (
                          <CMP.ChipUser
                            text={text}
                            history={history}
                            socket={socket}
                            chatroomId={chatroomId}
                          />
                        )}

                        <Typography
                          variant='body2'
                          className={
                            text.isMine ? classes.mineText : classes.text
                          }
                        >
                          {text.message}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                )}

                {response.map((text, index) => (
                  <Box
                    key={index}
                    className={text.isMine ? 'mine messages' : 'yours messages'}
                  >
                    <Paper
                      style={{ borderRadius: 20 }}
                      className={'message last'}
                    >
                      {!text.isMine && (
                        <CMP.ChipUser
                          text={text}
                          history={history}
                          socket={socket}
                          chatroomId={chatroomId}
                        />
                      )}
                      <Typography
                        className={text.isMine ? 'myText' : 'yourText'}
                      >
                        {text.message}
                      </Typography>
                    </Paper>
                  </Box>
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
