import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Chatroom } from './screens/chatroom/chatroom'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen/RegisterScreen'
import { Dashboard } from './screens/dashboard/dashboard'
import { UserChat } from './screens/userPrivateChat/user'
import { Profile } from './screens/profile/profile'
import { PrivateRoom } from './screens/MyPrivateRooms/privateRoom'

import { UA } from './actions/index'

import { io } from 'socket.io-client'

import { Header } from './components/Header'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.userLogin)
  const { counter, loading } = useSelector((state) => state.privateCount)

  const [chatroomId, setChatroomId] = React.useState('')

  let token
  if (userInfo) {
    token = userInfo.token
  }

  const socket = io('http://192.168.254.111:5000', {
    query: { token: token, room: chatroomId },
  })

  socket.connect()
  React.useEffect(() => {
    if (socket && !loading) {
      socket.on('refreshCount', () => {
        dispatch(UA.getPrvtMsgCount())
      })
    }
  }, [socket, loading, dispatch])

  React.useEffect(() => {
    if (userInfo) {
      dispatch(UA.getPrvtMsgCount())
      if (socket) {
        socket.emit('online', { chatroomId: userInfo._id })
      }
    }

    return () => {
      if (socket) {
        socket.emit('offline')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  return (
    <Router>
      <Header socket={socket} counter={counter} />
      <main>
        <Container>
          <Route
            path='/user/:name'
            render={(e) => (
              <UserChat {...e} socket={socket} sendChatroomId={setChatroomId} />
            )}
            exact
          />

          <Route
            path='/chatroom/:id'
            render={(e) => (
              <Chatroom
                {...e}
                socket={socket}
                sendChatroomId={(e) => setChatroomId(e)}
              />
            )}
            exact
          />

          <Route
            path='/private/:id'
            render={(e) => (
              <PrivateRoom {...e} socket={socket} counter={counter} />
            )}
            exact
          />

          <Route path='/profile' component={Profile} exact />
          <Route
            path='/login'
            render={(e) => <LoginScreen {...e} socket={socket} />}
          />
          <Route path='/register' component={RegisterScreen} />

          <Route
            path='/'
            render={(e) => <Dashboard {...e} socket={socket} />}
            exact
          />
        </Container>
      </main>
    </Router>
  )
}

export default App
