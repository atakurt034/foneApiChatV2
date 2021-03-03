import { USER } from '../constants/index'
import axios from 'axios'
import { action } from '../lib/index'

export const login = (email) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.LOGIN_REQUEST })

    const config = action.getConfig()

    const { data } = await axios.post('/api/users/login', email, config)
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.LOGIN_FAIL,
      payload: action.handleErros(error),
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

    const config = action.getConfig()

    const { data } = await axios.post('/api/users/', user, config)
    dispatch({ type: USER.REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER.LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER.REGISTER_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.DETAILS_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get(`/api/users/profile`, config)
    dispatch({ type: USER.DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: USER.DETAILS_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const userUpdateProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.UPDATE_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.put(`/api/users/profile`, user, config)
    dispatch({ type: USER.UPDATE_SUCCESS, payload: data.status })
  } catch (error) {
    dispatch({
      type: USER.UPDATE_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getPrivateRooms = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.PRIVATE_ROOMS_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get(
      `/api/chatrooms/private/${userInfo._id}`,
      config
    )
    const room = data.privateRooms.find((x) => x._id === id)
    dispatch({ type: USER.PRIVATE_ROOMS_SUCCESS, payload: room })
  } catch (error) {
    dispatch({
      type: USER.PRIVATE_ROOMS_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getPrivateMsgs = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.PRIVATE_MESSAGE_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get(
      `/api/chatrooms/private/${userInfo._id}`,
      config
    )
    dispatch({ type: USER.PRIVATE_MESSAGE_SUCCESS, payload: data.privateRooms })
  } catch (error) {
    dispatch({
      type: USER.PRIVATE_MESSAGE_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getPrvtMsgCount = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER.PRIVATE_MESSAGE_COUNT_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get('/api/chatrooms/private/message', config)
    const count = action.getCount(data)

    dispatch({
      type: USER.PRIVATE_MESSAGE_COUNT_SUCCESS,
      payload: count,
    })
  } catch (error) {
    dispatch({
      type: USER.PRIVATE_MESSAGE_COUNT_FAIL,
      payload: action.handleErros(error),
    })
  }
}
