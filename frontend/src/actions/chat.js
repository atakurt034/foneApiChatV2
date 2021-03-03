import { CHAT } from '../constants/index'
import axios from 'axios'
import { action } from '../lib/index'

export const getRooms = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.GET_ROOMS_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get('/api/chatrooms', config)
    dispatch({ type: CHAT.GET_ROOMS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.GET_ROOMS_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const createRoom = (name) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.CREATE_ROOM_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.post('/api/chatrooms', { name }, config)
    dispatch({ type: CHAT.CREATE_ROOM_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.CREATE_ROOM_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getRoomDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.GET_ROOM_DETAILS_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get(`/api/chatrooms/${id}`, config)
    dispatch({ type: CHAT.GET_ROOM_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.GET_ROOM_DETAILS_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const getMessages = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.GET_MESSAGES_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.get(`/api/chatrooms/messages/${id}`, config)
    dispatch({ type: CHAT.GET_MESSAGES_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.GET_MESSAGES_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const deleteRoom = (id, chatroomName) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.DELETE_ROOM_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.delete(`/api/chatrooms/${id}`, config)
    dispatch({ type: CHAT.DELETE_ROOM_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.DELETE_ROOM_FAIL,
      payload: action.handleErros(error),
    })
  }
}

export const editRoom = (id, text) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHAT.EDIT_ROOM_REQUEST })

    const userInfo = action.getUserInfo(getState)
    const config = action.getConfig(userInfo.token)

    const { data } = await axios.put(`/api/chatrooms/${id}`, { text }, config)
    dispatch({ type: CHAT.EDIT_ROOM_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: CHAT.EDIT_ROOM_FAIL,
      payload: action.handleErros(error),
    })
  }
}
