import { CHAT } from '../constants/index'

export const getRoomsReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.GET_ROOMS_REQUEST:
      return { loading: true }
    case CHAT.GET_ROOMS_SUCCESS:
      return { loading: false, rooms: action.payload }
    case CHAT.GET_ROOMS_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.GET_ROOMS_RESET:
      return {}
    default:
      return state
  }
}

export const createRoomsReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.CREATE_ROOM_REQUEST:
      return { loading: true, success: false }
    case CHAT.CREATE_ROOM_SUCCESS:
      return { loading: false, success: true }
    case CHAT.CREATE_ROOM_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.CREATE_ROOM_RESET:
      return {}
    default:
      return state
  }
}

export const getRoomDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.GET_ROOM_DETAILS_REQUEST:
      return { loading: true, success: false }
    case CHAT.GET_ROOM_DETAILS_SUCCESS:
      return { loading: false, room: action.payload }
    case CHAT.GET_ROOM_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.GET_ROOM_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const getMessagesReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.GET_MESSAGES_REQUEST:
      return { loading: true, success: false }
    case CHAT.GET_MESSAGES_SUCCESS:
      return { loading: false, messages: action.payload }
    case CHAT.GET_MESSAGES_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.GET_MESSAGES_RESET:
      return {}
    default:
      return state
  }
}

export const deleteRoomReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.DELETE_ROOM_REQUEST:
      return { loading: true, success: false }
    case CHAT.DELETE_ROOM_SUCCESS:
      return { loading: false, status: action.payload }
    case CHAT.DELETE_ROOM_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.DELETE_ROOM_RESET:
      return {}
    default:
      return state
  }
}

export const editRoomReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT.EDIT_ROOM_REQUEST:
      return { loading: true, success: false }
    case CHAT.EDIT_ROOM_SUCCESS:
      return { loading: false, status: action.payload }
    case CHAT.EDIT_ROOM_FAIL:
      return { loading: false, error: action.payload }
    case CHAT.EDIT_ROOM_RESET:
      return {}
    default:
      return state
  }
}
