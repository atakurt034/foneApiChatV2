import { Container } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
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
        <div>
          <label htmlFor='name'>Name</label>
          <input type='text' name='name' onChange={changeHandler} />
        </div>
        <div>
          <label htmlFor='message'>message</label>
          <input type='text' name='message' onChange={changeHandler} />
        </div>
        <button style={{ width: '10vw' }} type='submit'>
          Send
        </button>
      </form>
    </Container>
  )
}
