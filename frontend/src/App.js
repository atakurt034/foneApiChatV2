import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Chatroom } from './screens/chatroom/chatroom'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen/RegisterScreen'
import { Dashboard } from './screens/dashboard/dashboard'
import { UserChat } from './screens/userChatroom/user'
import { Profile } from './screens/profile/profile'
import { PrivateRoom } from './screens/privateRoom/privateRoom'

import { UA } from './actions/index'

import { io } from 'socket.io-client'

import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

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
    if (socket) {
      socket.on('refreshCount', () => {
        dispatch(UA.getPrvtMsgCount())
      })
    }
  }, [socket, dispatch])

  return (
    <Router>
      <Header socket={socket} />
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
            render={(e) => <PrivateRoom {...e} socket={socket} />}
            exact
          />

          <Route path='/profile' component={Profile} exact />
          <Route path='/login' component={LoginScreen} />
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
