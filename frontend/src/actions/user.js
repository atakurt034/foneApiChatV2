import { USER } from '../constants/index'
import axios from 'axios'

export const login = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.LOGIN_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/users/login', email, config)
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const logout = () => {
  return async (dispatch, getState) => {
    try {
      localStorage.removeItem('userInfo')
      dispatch({ type: USER.LOGOUT })
      document.location.href = '/login'
    } catch (err) {
      console.error(err)
    }
  }
}

export const register = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.REGISTER_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post('/api/users/', user, config)
    dispatch({ type: USER.REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
