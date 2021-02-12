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
