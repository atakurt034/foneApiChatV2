import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Chatroom } from './screens/chatroom/chatroom'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen/RegisterScreen'
import { Dashboard } from './screens/dashboard/dashboard'

import { io } from 'socket.io-client'

import Header from './components/Header'
import { useSelector } from 'react-redux'

const App = () => {
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

  return (
    <Router>
      <Header socket={socket} />
      <main>
        <Container>
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
