import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Chatroom } from './screens/chatroom/chatroom'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen/RegisterScreen'
import { Dashboard } from './screens/dashboard/dashboard'

import Header from './components/Header'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route path='/chatroom/:id' component={Chatroom} exact />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/' component={Dashboard} exact />
        </Container>
      </main>
    </Router>
  )
}

export default App
