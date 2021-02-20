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
      dispatch({ type: USER.LOGIN_REQUEST })
      localStorage.removeItem('userInfo')
      dispatch({ type: USER.LOGOUT })
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

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/users/profile`, config)
    dispatch({ type: USER.DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
