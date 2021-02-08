import { Button, Container, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'
const ENDPOINT = 'http://127.0.0.1:5000'

export const Home = () => {
  const [msg, setMsg] = useState({ name: '', message: '' })
  const [response, setResponse] = useState({ name: '', message: '' })

  const client = io()
  client.connect(ENDPOINT)
  useEffect(() => {
    client.on('output', (data) => {
      setResponse(data)
    })
  }, [client])

  const changeHandler = (event) => {
    const { name, value } = event.target

    setMsg({ ...msg, [name]: value })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    client.emit('input', msg)
  }

  return (
    <Container>
      <Typography variant='h1'>CHAT APP</Typography>
      <Link to='/login'>
        <Button>Login</Button>
      </Link>
      <div
        readOnly
        style={{
          height: '20vh',
          margin: '20px auto',
          textAlign: 'center',
          padding: 20,
          border: '2px solid #000',
        }}
      >
        <p>{response.message}</p>
      </div>
      <form
        onSubmit={submitHandler}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: 'auto',
          padding: 10,
        }}
      >
        <label htmlFor='name'>Name</label>
        <div>
          <input type='text' name='name' onChange={changeHandler} />
        </div>
        <label htmlFor='message'>message</label>
        <div>
          <input
            type='text'
            name='message'
            onChange={changeHandler}
            style={{ height: '10vh', width: '50%' }}
          />
        </div>
        <button
          style={{ width: '10vw', padding: 10, margin: 10 }}
          type='submit'
        >
          Send
        </button>
      </form>
    </Container>
  )
}
