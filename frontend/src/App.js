import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { Home } from './screens/home'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'

function App() {
  return (
    <Router>
      <main>
        <Container>
          <Route path='/login' component={LoginScreen} />
          <Route path='/' component={Home} exact />
        </Container>
      </main>
    </Router>
  )
}

export default App
